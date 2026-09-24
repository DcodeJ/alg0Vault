const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../WebApp/local-files.js');
const data=require('../WebApp/workspace-data.js');
function fixture(env={},confirmation=true) {
  let state={algorithms:[],notes:[],learning:[]},message='',error=false;
  const downloads=[],buttons=[{},{},{}],input={value:'',click(){this.clicked=true}},replacements=[];
  const api=create({env,buttons,input,snapshot:()=>state,parse:data.parseBackup,confirm:()=>confirmation,
    status:(m,e)=>{message=m;error=!!e},download:(name,text)=>downloads.push({name,text}),
    replace:x=>{state=x;replacements.push(x)}});
  return {api,input,buttons,downloads,replacements,get state(){return state},set state(x){state=x},get message(){return message},get error(){return error}};
}
function fileHandle(name='workspace.json') {
  let text=data.backup([],[],[]),fail='',writes=0,closes=0,aborts=0;
  const handle={name,getFile:async()=>({name,size:text.length,text:async()=>text}),createWritable:async()=>({
    write:async value=>{writes++;if(fail==='write')throw Error('write failed');handle.pending=value},
    close:async()=>{closes++;if(fail==='close')throw Error('close failed');text=handle.pending},
    abort:async()=>{aborts++}
  })};
  return {handle,get text(){return text},set text(x){text=x},set fail(x){fail=x},get writes(){return writes},get closes(){return closes},get aborts(){return aborts}};
}
test('portable save works without filesystem API and includes current in-memory state',async()=>{
  const f=fixture();f.state.notes=[{id:'n',body:'Pending edit'}];await f.api.save();
  assert.equal(JSON.parse(f.downloads[0].text).notes[0].body,'Pending edit');assert.match(f.message,/Download requested/);
  f.state.notes[0].body='New edit';f.api.refresh();assert.match(f.message,/newer changes/);
});
test('linked save waits for close, reuses chosen handle and tracks dirty state',async()=>{
  const h=fileHandle();let picks=0;const f=fixture({showSaveFilePicker:async()=>{picks++;return h.handle}});
  await f.api.save();assert.equal(h.closes,1);assert.match(f.message,/up to date/);assert.equal(f.api.hasUnsavedFile(),false);
  f.state.notes=[{id:'new',body:'Edit'}];f.api.refresh();assert.equal(f.api.hasUnsavedFile(),true);assert.match(f.message,/need Save file/);
  await f.api.save();assert.equal(picks,1);assert.equal(h.closes,2);assert.equal(f.api.hasUnsavedFile(),false);
});
test('external file changes block overwriting without changing current workspace',async()=>{
  const h=fileHandle();const f=fixture({showSaveFilePicker:async()=>h.handle});await f.api.save();
  h.text='external edit';f.state.notes=[{id:'keep'}];await f.api.save();
  assert.equal(h.text,'external edit');assert.equal(h.writes,1);assert.match(f.message,/changed outside/);assert.equal(f.api.hasUnsavedFile(),true);
});
for(const failure of ['write','close'])test(`failed ${failure} aborts stream and never reports saved`,async()=>{
  const h=fileHandle();h.fail=failure;const f=fixture({showSaveFilePicker:async()=>h.handle});await f.api.save();
  assert.equal(f.error,true);assert.match(f.message,/failed/);assert.equal(h.aborts,1);assert.ok(f.buttons.every(b=>!b.disabled));
});
test('failed Save as leaves previous handle linked and usable',async()=>{
  const a=fileHandle('a.json'),b=fileHandle('b.json');let n=0;
  const f=fixture({showSaveFilePicker:async()=>++n===1?a.handle:b.handle});await f.api.save();b.fail='close';await f.api.save(true);
  f.state.notes=[{id:'new'}];await f.api.save();assert.equal(a.closes,2);assert.equal(n,2);assert.match(f.message,/a.json/);
});
test('cancelled picker is quiet and does not change workspace',async()=>{
  const f=fixture({showSaveFilePicker:async()=>{throw Object.assign(Error('cancelled'),{name:'AbortError'})}});await f.api.save();
  assert.equal(f.error,false);assert.equal(f.downloads.length,0);assert.equal(f.replacements.length,0);
});
test('edits made during async disk writing remain marked unsaved',async()=>{
  let finish;const h=fileHandle();const createWritable=h.handle.createWritable;
  h.handle.createWritable=async()=>{const stream=await createWritable();return {...stream,close:async()=>{await new Promise(r=>finish=r);await stream.close()}}};
  const f=fixture({showSaveFilePicker:async()=>h.handle});const pending=f.api.save();
  while(!finish)await new Promise(r=>setImmediate(r));
  f.state.notes=[{id:'later'}];assert.ok(f.buttons.every(x=>x.disabled));await f.api.save();finish();await pending;
  assert.equal(h.writes,1);assert.equal(JSON.parse(h.text).notes.length,0);assert.equal(f.api.hasUnsavedFile(),true);
});

test('first save remains protected from closing while its disk write is pending', async () => {
  let finish; const h = fileHandle(); const original = h.handle.createWritable;
  h.handle.createWritable = async () => { const stream = await original(); return {...stream, close:async()=>{await new Promise(r=>finish=r); await stream.close();}}; };
  const f = fixture({showSaveFilePicker:async()=>h.handle}); const pending = f.api.save();
  while (!finish) await new Promise(r=>setImmediate(r));
  const guarded = f.api.hasUnsavedFile();
  finish(); await pending;
  assert.equal(guarded, true);
  assert.equal(f.api.hasUnsavedFile(), false);
});
test('open links selected file only after validated confirmed exact load and safety download',async()=>{
  const h=fileHandle();h.text=data.backup([{id:'incoming',title:'Saved'}],[],[]);
  const f=fixture({showOpenFilePicker:async()=>[h.handle]});f.state.notes=[{id:'previous'}];await f.api.open();
  assert.equal(f.state.notes.length,0);assert.equal(f.state.algorithms[0].id,'incoming');assert.equal(f.replacements.length,1);
  assert.equal(JSON.parse(f.downloads[0].text).notes[0].id,'previous');assert.match(f.downloads[0].name,/before-open/);
  f.state.notes.push({id:'edit'});await f.api.save();assert.equal(JSON.parse(h.text).notes[0].id,'edit');
});
test('cancelled open preserves data and does not request a safety download',async()=>{
  const h=fileHandle();const f=fixture({showOpenFilePicker:async()=>[h.handle]},false);await f.api.open();
  assert.equal(f.replacements.length,0);assert.equal(f.downloads.length,0);
});
test('invalid and oversized files cannot replace workspace or generate safety download',async()=>{
  const f=fixture();for(const file of [{size:3,text:async()=>'{x}'},{size:21*1024*1024,text:async()=>{throw Error('must not read')}}]){
    await f.input.onchange({target:{files:[file],value:'a'}});assert.equal(f.error,true);
  }assert.equal(f.replacements.length,0);assert.equal(f.downloads.length,0);
});
test('fallback open uses local input and clearly states that no writable handle is linked',async()=>{
  const f=fixture();f.api.open();assert.equal(f.input.clicked,true);
  await f.input.onchange({target:{files:[{size:50,text:async()=>data.backup([],[],[])}],value:'a'}});
  assert.match(f.message,/Save file loaded/);assert.match(f.message,/No file linked/);await f.api.save();assert.equal(f.downloads.length,2);
});
