// DOM-contract checks for the opt-in translator, not visual browser verification.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function setup() {
  const nodes = [], values = new Map();
  let callback, observed, disconnects=0;
  function element(tag,attrs={},text='',parent=null) {
    const node={tagName:tag.toUpperCase(),attrs:{...attrs},textContent:text,
      dataset:Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v])),
      setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k]??null;},hasAttribute(k){return Object.hasOwn(this.attrs,k);},
      parentElement:parent,childElementCount:0,
      matches(){return ['INPUT','TEXTAREA','PRE','CODE'].includes(this.tagName)||this.hasAttribute('contenteditable')||this.hasAttribute('data-no-i18n');},
      closest(){return this.matches() ? this : this.parentElement?.closest() || null;}};
    if(parent) parent.childElementCount++;
    nodes.push(node);return node;
  }
  const doc={body:{},documentElement:{lang:'en'},
    querySelector:selector=>nodes.find(x=>x.attrs.id===selector.slice(1))||null,
    querySelectorAll:selector=>nodes.filter(x=>x.hasAttribute(selector.slice(1,-1)))};
  const context={document:doc,localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)},
    MutationObserver:class {constructor(fn){callback=fn;}disconnect(){disconnects++;}observe(target,options){observed={target,options};}}};
  context.window=context;
  vm.createContext(context);
  for(const file of ['locale-data.js','locale.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../WebApp',file),'utf8'),context);
  return {api:context.VaultLocale,table:context.ALG0_UI_TRANSLATIONS,element,doc,values,notify:()=>callback(),get observed(){return observed;},get disconnects(){return disconnects;}};
}
test('newly rendered controls localize reactively, keep option values, and restore without duplicate observers',()=>{
  const app=setup();app.api.setLocale('pl');
  const option=app.element('option',{'data-i18n-live':''},'Easy');
  const button=app.element('button',{id:'editCode'},'Edit Python');
  app.notify();
  assert.equal(app.doc.documentElement.lang,'pl');
  assert.equal(option.textContent,'Łatwy');assert.equal(option.attrs.value,'Easy');
  assert.equal(button.textContent,'Edytuj Python');
  button.textContent='Preview';app.notify();assert.equal(button.textContent,'Podgląd');
  app.api.setLocale('en');
  assert.equal(app.doc.documentElement.lang,'en');
  assert.equal(button.textContent,'Preview');assert.equal(option.textContent,'Easy');
  assert.equal(option.attrs.value,'Easy');
  assert.ok(app.disconnects>=4);
  assert.equal(app.observed.target,app.doc.body);
  assert.equal(app.observed.options.characterData,true);
  assert.equal(app.observed.options.subtree,true);
});
test('unmarked personal content and editable/code nodes are never live-translated',()=>{
  const app=setup();
  const personal=app.element('p',{},'Delete');
  const code=app.element('code',{'data-i18n-live':''},'Save changes');
  const title=app.element('h1',{'contenteditable':'true','data-i18n-live':''},'Save file');
  const textarea=app.element('textarea',{'data-i18n-live':''},'Today');
  app.api.setLocale('pl');app.notify();
  assert.equal(personal.textContent,'Delete');assert.equal(code.textContent,'Save changes');
  assert.equal(title.textContent,'Save file');assert.equal(textarea.textContent,'Today');
  assert.equal(app.values.size,1);
  assert.equal(app.values.get('alg0vault.web.locale.v1'),'pl');
});

test('nested translation markers cannot rewrite code, editable titles, or an opted-out subtree',()=>{
  const app=setup();
  const token=Object.keys(app.table).find(key=>app.table[key][0]==='Save changes');
  const protectedParents=[app.element('pre'),app.element('h1',{contenteditable:'true'}),app.element('section',{'data-no-i18n':''})];
  const children=protectedParents.flatMap(parent=>[
    app.element('span',{'data-i18n':token},'Save changes',parent),
    app.element('span',{'data-i18n-live':''},'Save changes',parent)
  ]);
  const mixed=app.element('button',{'data-i18n':token},'Save changes');
  app.element('span',{},'My personal label',mixed);
  app.api.setLocale('pl'); app.notify();
  for(const node of children)assert.equal(node.textContent,'Save changes');
  assert.equal(mixed.textContent,'Save changes');
  assert.equal(mixed.childElementCount,1);
});

test('backup and recovery messages translate while keeping unknown error details intact',()=>{
  const app=setup();app.api.setLocale('pl');
  assert.match(app.api.t('Import 3 new records? Existing records with the same ID will be kept.'),/identyfikatorach zostaną zachowane/);
  assert.equal(app.api.t('Imported 3 records.'),'Zaimportowano wpisy: 3.');
  assert.equal(app.api.t('Import failed: Choose a backup smaller than 20 MB.'),'Import nie powiódł się: Wybierz kopię zapasową mniejszą niż 20 MB.');
  assert.equal(app.api.t('Import failed: Unknown error #912'),'Import nie powiódł się: Unknown error #912');
  const message='This file changed outside the app. Open it again or use Save file as… to avoid overwriting those changes.';
  assert.match(app.api.t(message),/nie nadpisać zmian/);
  app.api.setLocale('en');assert.equal(app.api.t(message),message);
});
