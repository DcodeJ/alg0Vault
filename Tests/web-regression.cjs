// Run with: node --test Tests/web-regression.cjs
// Data tests plus application startup/event checks using a small DOM double.
// This is not a substitute for visual browser verification.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const data = require('../WebApp/workspace-data.js');
const key = 'alg0vault.web.algorithms.v1';
const notesKey = 'alg0vault.web.notes.v1';
const learningKey = 'alg0vault.web.learning.v1';
const learningUI = require('../WebApp/learning.js');
const study = require('../WebApp/study-tools.js');
const desk = require('../WebApp/study-desk.js');
test('daily plan selects due reviews, unfinished weeks and highest-priority unfinished algorithms',()=>{
  const items=[{id:'week-01',kind:'week'},{id:'week-02',kind:'week'},{id:'term',kind:'glossary'}];
  const progress=[{id:'week-01',completed:true},{id:'term',reviewEnabled:true,reviewDue:'2020-01-01'}];
  const algorithms=[{id:'a',title:'Advanced',priority:'Advanced'},{id:'e',title:'Essential',priority:'Essential'},{id:'m',title:'Done',priority:'Essential',masteryLevel:'Mastered'}];
  const p=desk.plan(algorithms,items,progress);assert.equal(p.next.id,'e');assert.equal(p.week.id,'week-02');assert.equal(p.due[0].id,'term');assert.equal(p.completed,1);
  assert.equal(desk.plan([],[],[]).next,undefined);
});
test('unified search is accent-insensitive, searches replies and combines query words',()=>{
  const notes=[{id:'n',title:'Sieć',body:'',course:'Podstawy',replies:[{content:'Żółć and routing'}]}];
  assert.equal(desk.search('zolc routing',[],[],notes)[0].id,'n');assert.equal(desk.search('absent',[],[],notes).length,0);
  assert.equal(desk.search('   ',[],[],notes).length,0);
});
test('Today shows live plan and search results safely navigate to a glossary lesson',()=>{
  const app=boot();assert.match(app.nodes.get('deskPlan').innerHTML,/RECALL/);assert.equal(app.nodes.get('focusClock').textContent,'25:00');
  app.nodes.get('deskSearch').value='encapsulation';app.nodes.get('deskSearch').oninput();
  assert.match(app.nodes.get('deskResults').innerHTML,/Encapsulation/i);
  const button=app.all.findLast(x=>x.dataset.deskId==='term-encapsulation');assert.ok(button);
  app.nodes.get('homeView').onclick({target:button});assert.equal(app.nodes.get('learningView').classList.contains('hidden'),false);
  assert.match(app.nodes.get('learningDetail').innerHTML,/Encapsulation/i);
});
test('Today practice recommendation opens that exact algorithm and priority filter restricts pool',()=>{
  const app=boot({[key]:JSON.stringify([{id:'one',title:'My foundation',priority:'Essential'},{id:'two',title:'Later',priority:'Advanced'}])});
  const button=app.all.findLast(x=>x.dataset.deskKind==='practice');app.nodes.get('homeView').onclick({target:button});
  assert.match(app.nodes.get('challengeCard').innerHTML,/My foundation/);
  app.nodes.get('practicePriority').value='Advanced';app.nodes.get('practicePriority').onchange();assert.match(app.nodes.get('challengeCard').innerHTML,/Later/);
});
test('focus timer starts, pauses, resets and changes length without changing study data',()=>{
  const app=boot();const before=Object.fromEntries(app.values);
  app.nodes.get('focusToggle').onclick();assert.equal(app.nodes.get('focusToggle').textContent,'Pause');
  app.nodes.get('focusToggle').onclick();assert.equal(app.nodes.get('focusToggle').textContent,'Start');
  app.nodes.get('focusLength').value='5';app.nodes.get('focusLength').onchange();assert.equal(app.nodes.get('focusClock').textContent,'05:00');
  assert.deepEqual(Object.fromEntries(app.values),before);
});
test('search renders untrusted user titles as text and clearing resets results',()=>{
  const app=boot({[notesKey]:JSON.stringify([{id:'n',title:'<img src=x onerror=bad()>',body:'uniquecheck'}])});
  app.nodes.get('deskSearch').value='uniquecheck';app.nodes.get('deskSearch').oninput();
  assert.match(app.nodes.get('deskResults').innerHTML,/&lt;img/);assert.doesNotMatch(app.nodes.get('deskResults').innerHTML,/<img/);
  app.nodes.get('deskClear').onclick();assert.equal(app.nodes.get('deskResults').innerHTML,'');
});
test('algorithm catalog has 100 unique entries with valid categories and study priorities',()=>{
  const context={window:{}};
  for(const file of ['algorithms.js','algorithm-pack.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'WebApp',file),'utf8'),context);
  const rows=context.window.ALG0_ALGORITHMS,catalog=context.window.VaultCatalog;
  assert.equal(rows.length,100);assert.equal(new Set(rows.map(x=>x.title)).size,100);assert.equal(new Set(rows.map(x=>x.id)).size,100);
  for(const x of rows)assert.ok(['Essential','Core','Advanced'].includes(catalog.priority(x)));
  assert.equal(catalog.priority({priority:'malformed'}),'Unranked');
  const app=boot();app.nodes.get('essentialAlgorithms').onclick();
  assert.equal(app.nodes.get('resultCount').textContent,rows.filter(x=>catalog.priority(x)==='Essential').length+' items');
  assert.match(app.nodes.get('algorithmList').innerHTML,/Essential/);
  app.nodes.get('clearFilters').onclick();assert.equal(app.nodes.get('resultCount').textContent,'100 items');
});
test('existing libraries opt into new pack; edits and deliberate deletion remain authoritative',()=>{
  const app=boot({[key]:JSON.stringify([{id:'mine',title:'Personal algorithm',priority:'Core'}])});
  assert.equal(app.nodes.get('algorithmCount').textContent,1);assert.equal(app.nodes.get('addAlgorithmPack').textContent,'Add 40 new algorithms');
  app.nodes.get('addAlgorithmPack').onclick();assert.equal(app.nodes.get('algorithmCount').textContent,41);
  app.nodes.get('addAlgorithmPack').onclick();assert.equal(app.nodes.get('algorithmCount').textContent,41);
  const saved=JSON.parse(app.values.get(key));assert.equal(saved[0].title,'Personal algorithm');
  const reloaded=boot({[key]:JSON.stringify(saved.filter(x=>!x.id.startsWith('pack-2026-')))});
  assert.equal(reloaded.nodes.get('algorithmCount').textContent,1);
});
test('priority editing persists and new algorithms remain visible after Essential filtering',()=>{
  const app=boot({[key]:JSON.stringify([{id:'mine',title:'Mine'}])});
  const field=app.nodes.get('field-priority');field.value='Essential';
  app.nodes.get('detailPane').oninput({target:field});app.flush();
  assert.equal(JSON.parse(app.values.get(key))[0].priority,'Essential');
  app.nodes.get('essentialAlgorithms').onclick();assert.equal(app.nodes.get('resultCount').textContent,'1 item');
  app.nodes.get('newAlgorithm').onclick();assert.equal(app.nodes.get('priorityFilter').value,'');assert.equal(app.nodes.get('resultCount').textContent,'2 items');
});
async function openSnapshot(app,snapshot) {
  const text=JSON.stringify({app:'alg0Vault',version:1,...snapshot});
  await app.nodes.get('saveFileInput').onchange({target:{files:[{name:'study.json',size:text.length,text:async()=>text}],value:'file'}});
}
test('Open save file replaces rather than merges, restoring priorities, theme and recall progress',async()=>{
  const app=boot({[key]:JSON.stringify([{id:'old'}]),[notesKey]:JSON.stringify([{id:'old-note'}])});
  await openSnapshot(app,{algorithms:[{id:'saved',title:'My algorithm',priority:'Core',code:'// restored'}],notes:[],learning:[{id:'week-01',bookmarked:true,reviewEnabled:true,recallCount:3}],settings:{theme:'Ocean'}});
  assert.equal(app.nodes.get('algorithmCount').textContent,1);assert.equal(JSON.parse(app.values.get(key))[0].id,'saved');
  assert.equal(JSON.parse(app.values.get(key))[0].priority,'Core');assert.deepEqual(JSON.parse(app.values.get(notesKey)),[]);
  assert.equal(JSON.parse(app.values.get(learningKey))[0].recallCount,3);assert.equal(app.body.dataset.theme,'ocean');
  const safety=JSON.parse(await app.downloads[0].text());assert.equal(safety.algorithms[0].id,'old');assert.equal(safety.notes[0].id,'old-note');
  const reload=boot(Object.fromEntries(app.values));assert.equal(reload.nodes.get('algorithmCount').textContent,1);assert.equal(reload.body.dataset.theme,'ocean');
});
test('empty save-file collections stay empty on reload and old backups open without settings',async()=>{
  const app=boot();await openSnapshot(app,{algorithms:[],notes:[]});
  assert.equal(app.nodes.get('algorithmCount').textContent,0);assert.deepEqual(JSON.parse(app.values.get(learningKey)),[]);
  assert.equal(boot(Object.fromEntries(app.values)).nodes.get('algorithmCount').textContent,0);
});
test('save-file replacement cancellation and invalid theme leave current workspace untouched',async()=>{
  const initial={[key]:JSON.stringify([{id:'keep'}])};const app=boot(initial,false,false);
  await openSnapshot(app,{algorithms:[],notes:[]});assert.equal(app.downloads.length,0);assert.equal(app.values.get(key),initial[key]);
  const bad=boot(initial);await openSnapshot(bad,{algorithms:[],notes:[],settings:{theme:'invalid'}});
  assert.equal(bad.values.get(key),initial[key]);assert.equal(bad.downloads.length,0);assert.equal(bad.nodes.get('fileStatus').dataset.state,'error');
});
test('save-file storage failure rolls back all writes and preserves current in-memory data',async()=>{
  const initial={[key]:JSON.stringify([{id:'keep'}]),[notesKey]:JSON.stringify([{id:'keep-note'}]),[learningKey]:'[]'};
  const app=boot(initial,(k,v)=>k===learningKey&&v!=='[]');
  await openSnapshot(app,{algorithms:[],notes:[],learning:[{id:'week-01'}],settings:{theme:'Rose'}});
  for(const [k,v]of Object.entries(initial))assert.equal(app.values.get(k),v);
  assert.equal(app.nodes.get('algorithmCount').textContent,1);assert.equal(app.nodes.get('fileStatus').dataset.state,'error');
  await app.nodes.get('saveWorkspaceFile').onclick();assert.equal(JSON.parse(await app.downloads.at(-1).text()).algorithms[0].id,'keep');
});
test('portable save includes pending edits and theme even when browser storage is unavailable',async()=>{
  const app=boot({[key]:JSON.stringify([{id:'mine'}])},true);
  const field=app.nodes.get('summaryInput');field.value='Not yet saved in browser';app.nodes.get('detailPane').oninput({target:field});
  app.nodes.get('themeSelect').onchange({target:{value:'Emerald'}});await app.nodes.get('saveWorkspaceFile').onclick();
  const saved=JSON.parse(await app.downloads.at(-1).text());assert.equal(saved.algorithms[0].summary,field.value);assert.equal(saved.settings.theme,'Emerald');
});
test('review scheduling has bounded steps, deterministic intervals and exact due boundaries', () => {
  const now = Date.parse('2026-09-08T10:00:00Z');
  let record = {};
  for (const days of [1,3,7,14,30,30]) {
    record = study.grade(record,'good',now);
    assert.equal(Date.parse(record.reviewDue)-now, days*86400000);
    assert.ok(record.reviewStep <= 4);
  }
  const again = study.grade(record,'again',now);
  assert.equal(Date.parse(again.reviewDue)-now,600000); assert.equal(again.reviewStep,0);
  const hard = study.grade(record,'hard',now);
  assert.equal(Date.parse(hard.reviewDue)-now,86400000); assert.equal(hard.reviewStep,4);
  assert.equal(study.due(hard,Date.parse(hard.reviewDue)-1),false);
  assert.equal(study.due(hard,Date.parse(hard.reviewDue)),true);
  assert.equal(study.due({...hard,reviewEnabled:false},now+86400000),false);
  assert.equal(study.due({reviewEnabled:true,reviewDue:null},now),true);
  assert.throws(()=>study.grade({},'invalid',now));
});
test('old learning records migrate and malformed review fields normalize safely', () => {
  const [legacy] = data.learning([{id:'week-01',notes:'Keep me',completed:true}]);
  assert.equal(legacy.notes,'Keep me'); assert.equal(legacy.completed,true);
  assert.equal(legacy.bookmarked,false); assert.equal(legacy.reviewEnabled,false);
  const [bad] = data.learning([{id:'term-null',bookmarked:'true',reviewEnabled:true,reviewDue:'bad date',reviewStep:999,recallCount:-1}]);
  assert.equal(bad.bookmarked,false); assert.equal(bad.reviewDue,null); assert.equal(bad.reviewStep,0); assert.equal(bad.recallCount,0);
});
test('course recall rotates through questions and glossary recall has reference material', () => {
  const items=learningContent().items;
  const course=items.find(x=>x.id==='course-programming');
  const first=study.recall(course,0),second=study.recall(course,1);
  assert.notEqual(first.question,second.question); assert.equal(study.recall(course,3).question,first.question);
  assert.match(first.answer,/integer division/);
  const term=study.recall(items.find(x=>x.id==='term-null'));
  assert.ok(term.question.length>20); assert.match(term.answer,/no object reference/);
});
test('bookmarks persist, filter correctly, and leave completion and notes unchanged', () => {
  const initial=data.learning([{id:'week-01',notes:'Important note',completed:true}]);
  const app=boot({[learningKey]:JSON.stringify(initial)}); openLearning(app,'week-01');
  app.nodes.get('studyBookmark').onclick();
  const [saved]=JSON.parse(app.values.get(learningKey));
  assert.equal(saved.bookmarked,true); assert.equal(saved.notes,'Important note'); assert.equal(saved.completed,true);
  app.nodes.get('learningStatus').value='bookmarked'; app.nodes.get('learningStatus').onchange();
  assert.equal(app.nodes.get('learningCount').textContent,'1 / 197 entries');
  const reload=boot(Object.fromEntries(app.values));openLearning(reload,'week-01');
  assert.equal(reload.nodes.get('studyBookmark').attrs['aria-pressed'],'true');
  reload.nodes.get('studyBookmark').onclick();
  assert.equal(JSON.parse(reload.values.get(learningKey))[0].bookmarked,false);
});
test('recall grading is only exposed after reveal and cannot count a double click twice', () => {
  const app=boot();openLearning(app,'course-programming');
  app.nodes.get('studyRecall').onclick();
  assert.equal(app.nodes.has('studyGood'),false);
  assert.equal(app.nodes.get('studyAnswer').innerHTML,'');
  app.nodes.get('studyReveal').onclick();
  assert.match(app.nodes.get('studyAnswer').innerHTML,/integer division/);
  const grade=app.nodes.get('studyGood').onclick;grade();grade();
  const [saved]=JSON.parse(app.values.get(learningKey));
  assert.equal(saved.recallCount,1); assert.equal(saved.reviewEnabled,true); assert.equal(saved.completed,false);
  assert.ok(Date.parse(saved.reviewDue)>Date.now());
});
test('today dashboard prioritizes due reviews and preserves drafts when opening a lesson', () => {
  const saved=data.learning([{id:'course-ai',reviewEnabled:true,reviewDue:'2020-01-01T00:00:00Z',bookmarked:true}, {id:'week-01',completed:false}]);
  const app=boot({[learningKey]:JSON.stringify(saved)});openLearning(app,'week-01');
  const journal=app.nodes.get('learningJournal');journal.value='Pending before dashboard';journal.oninput({target:journal});
  app.nodes.get('studyToday').onclick();
  assert.match(app.nodes.get('learningDetail').innerHTML,/What should I study next/);
  assert.match(app.nodes.get('learningDetail').innerHTML,/Start with one due review/);
  assert.equal(JSON.parse(app.values.get(learningKey)).find(x=>x.id==='week-01').notes,journal.value);
  const jump=app.all.findLast(x=>x.dataset.learningId==='course-ai');
  app.nodes.get('learningDetail').onclick({target:jump});
  assert.match(app.nodes.get('learningDetail').innerHTML,/Artificial intelligence/);
  app.nodes.get('studyReviewToggle').onclick();
  app.nodes.get('studyToday').onclick();
  assert.match(app.nodes.get('learningDetail').innerHTML,/No reviews are due/);
});
test('due and unfinished filters, course shortcut and reset remain predictable', () => {
  const saved=data.learning([{id:'course-ai',reviewEnabled:true,reviewDue:'2020-01-01T00:00:00Z'}, {id:'week-01',completed:true}]);
  const app=boot({[learningKey]:JSON.stringify(saved)});openLearning(app);
  app.nodes.get('learningStatus').value='due';app.nodes.get('learningStatus').onchange();
  assert.equal(app.nodes.get('learningCount').textContent,'1 / 197 entries');
  app.nodes.get('learningCourses').onclick();
  assert.equal(app.nodes.get('learningStatus').value,'');assert.equal(app.nodes.get('learningCount').textContent,'20 / 197 entries');
  app.nodes.get('learningReset').onclick();
  app.nodes.get('learningKind').value='week';app.nodes.get('learningStatus').value='unfinished';app.nodes.get('learningStatus').onchange();
  assert.equal(app.nodes.get('learningCount').textContent,'39 / 197 entries');
});
test('bookmarks and recall schedule roundtrip through workspace export and restore', async () => {
  const app=boot();openLearning(app,'course-ai');app.nodes.get('studyBookmark').onclick();
  app.nodes.get('studyRecall').onclick();app.nodes.get('studyReveal').onclick();app.nodes.get('studyAgain').onclick();
  app.nodes.get('exportBackup').onclick();const exported=await app.downloads[0].text();
  const expected=data.parseBackup(exported).learning[0];
  const restored=boot();await restored.nodes.get('backupFile').onchange({target:{files:[{size:exported.length,text:async()=>exported}],value:'file'}});
  const record=JSON.parse(restored.values.get(learningKey)).find(x=>x.id==='course-ai');
  assert.equal(record.bookmarked,true);assert.equal(record.recallCount,1);assert.equal(record.reviewDue,expected.reviewDue);
});
test('failed recall storage stays flagged and remains available in a session export', async () => {
  const app=boot({},true);openLearning(app,'week-01');app.nodes.get('studyReviewToggle').onclick();
  assert.equal(app.nodes.get('saveStatus').dataset.state,'error');assert.equal(app.values.has(learningKey),false);
  app.nodes.get('exportBackup').onclick();
  assert.equal(data.parseBackup(await app.downloads[0].text()).learning[0].reviewEnabled,true);
});
test('all 20 Polish course titles and complete distinct guides are bundled', () => {
  const expected = ['Podstawy programowania','Podstawy sieci','Podstawy systemów operacyjnych','Algorytmy i struktury danych','Podstawy systemów serwerowych','Wstęp do bezpieczeństwa danych','Zaawansowane sieci komputerowe','Technologie informacyjne i ochrona własności intelektualnej','Systemy operacyjne','Sztuczna inteligencja','Zarządzanie bezpieczeństwem informacji','Podstawy typografii i składu komputerowego','Internet Rzeczy','Zakładanie działalności gospodarczej','Analiza danych/uczenie maszynowe (ML)','Aplikacje internetowe','Inżynieria programowania','Grafika komputerowa i komunikacja człowiek komputer','Projektowanie systemów baz danych','Projektowanie i utrzymanie portali internetowych'];
  const { courses, sources } = require('../StudyContent/courses.cjs');
  const content = learningContent().items.filter(x => x.kind === 'course');
  assert.deepEqual(Array.from(content, x => x.title), expected);
  for (const c of courses) {
    assert.equal(c.points.length, 6); assert.equal(c.practice.length, 3); assert.equal(c.questions.length, 3);
    assert.ok(c.questions.every(([q,a]) => q.length > 10 && a.length > 20));
    for (const related of c.related) assert.ok(courses.some(x => x.id === related));
    for (const week of c.weeks) assert.ok(week >= 1 && week <= 40);
    for (const resource of c.resources) assert.match(sources[resource][1], /^https:\/\//);
  }
  for (const c of content) for (const heading of ['Before you start','Main points explained','Step-by-step practice','Recall questions','Answer guidance','Common mistake','Further study','When to mark this guide reviewed']) assert.ok(c.markdown.includes(heading), c.id + heading);
  assert.match(content.find(x => x.id === 'course-os-basics').markdown, /working directory/);
  assert.match(content.find(x => x.id === 'course-operating-systems').markdown, /Deadlock/);
});

test('course shortcut, accent-insensitive search and English topic search work', () => {
  const app = boot(); openLearning(app);
  app.nodes.get('learningCourses').onclick();
  assert.equal(app.nodes.get('learningKind').value, 'course');
  assert.equal(app.nodes.get('learningCount').textContent, '20 / 197 entries');
  for (const query of ['zakladanie dzialalnosci', 'Zakładanie działalności', 'starting a business']) {
    app.nodes.get('learningSearch').value = query; app.nodes.get('learningSearch').oninput();
    if (query !== 'starting a business') assert.equal(app.nodes.get('learningCount').textContent, '1 / 197 entries');
    assert.match(app.nodes.get('learningList').innerHTML, /course-business/);
    assert.match(app.nodes.get('learningDetail').innerHTML, /Starting a business/);
  }
  app.nodes.get('learningCourses').onclick();
  assert.equal(app.nodes.get('learningSearch').value, '');
  assert.equal(app.nodes.get('learningCount').textContent, '20 / 197 entries');
});

test('course guides link to distinct related subjects and roadmap weeks', () => {
  const app = boot(); openLearning(app, 'course-network-basics');
  assert.match(app.nodes.get('learningDetail').innerHTML, /course-advanced-networks/);
  const related = app.all.findLast(x => x.dataset.learningId === 'course-advanced-networks');
  app.nodes.get('learningDetail').onclick({ target: related });
  assert.match(app.nodes.get('learningDetail').innerHTML, /Advanced computer networks/);
  const week = app.all.findLast(x => x.dataset.learningId === 'week-20');
  app.nodes.get('learningDetail').onclick({ target: week });
  assert.match(app.nodes.get('learningDetail').innerHTML, /Week 20/);
});

test('course review and notes survive reload, reopen and backup independently of roadmap', async () => {
  const app = boot(); openLearning(app, 'course-programming');
  const journal = app.nodes.get('learningJournal'); journal.value = 'Moje notatki: tested the calculator.'; journal.oninput({target:journal});
  app.nodes.get('learningComplete').onclick();
  assert.equal(app.nodes.get('courseProgress').textContent, '1 / 20 guides reviewed');
  assert.equal(app.nodes.get('learningMeter').value, 0);
  assert.match(app.nodes.get('learningComplete').textContent, /Guide reviewed/);
  app.nodes.get('exportBackup').onclick();
  const exported = await app.downloads[0].text();
  assert.equal(data.parseBackup(exported).learning[0].notes, journal.value);
  const restored = boot();
  await restored.nodes.get('backupFile').onchange({target:{files:[{size:exported.length,text:async()=>exported}],value:'file'}});
  const reloaded = boot(Object.fromEntries(restored.values)); openLearning(reloaded, 'course-programming');
  assert.equal(reloaded.nodes.get('courseProgress').textContent, '1 / 20 guides reviewed');
  assert.match(reloaded.nodes.get('learningDetail').innerHTML, /Moje notatki/);
  reloaded.nodes.get('learningComplete').onclick();
  assert.equal(reloaded.nodes.get('courseProgress').textContent, '0 / 20 guides reviewed');
});

test('course study threads are reused and preserve existing personal threads', () => {
  const app = boot({[notesKey]:JSON.stringify([{id:'mine',title:'Existing',body:'Keep my work',replies:[]}])});
  openLearning(app,'course-ai'); app.nodes.get('learningStudyNote').onclick();
  openLearning(app,'course-ai'); app.nodes.get('learningStudyNote').onclick();
  const records = JSON.parse(app.values.get(notesKey));
  assert.equal(records.length,2); assert.equal(records[0].course,'University courses'); assert.equal(records[1].body,'Keep my work');
});

test('all twelve appearance choices persist and restore, including original themes', () => {
  const names = ['Current','Dark','Purple','White','Ocean','Emerald','Rose','Amber','Crimson','Slate','Sky','Paper'];
  const html = fs.readFileSync(path.join(root,'WebApp/index.html'),'utf8');
  const select = /<select id="themeSelect">([\s\S]*?)<\/select>/.exec(html)[1];
  assert.deepEqual([...select.matchAll(/<option\b[^>]*value="([^"]+)"[^>]*>/g)].map(x=>x[1]),names);
  for (const name of names) {
    const app=boot(); app.nodes.get('themeSelect').onchange({target:{value:name}});
    assert.equal(app.body.dataset.theme,name.toLowerCase());
    assert.equal(app.values.get('alg0vault.web.theme'),name);
    const restored=boot(Object.fromEntries(app.values));
    assert.equal(restored.body.dataset.theme,name.toLowerCase());
    assert.equal(restored.nodes.get('themeSelect').value,name);
  }
});

test('invalid saved themes fall back safely and failed theme storage keeps session choice', () => {
  const invalid=boot({'alg0vault.web.theme':'unknown-palette'});
  assert.equal(invalid.body.dataset.theme,'current');
  const blocked=boot({},true); blocked.nodes.get('themeSelect').onchange({target:{value:'Ocean'}});
  assert.equal(blocked.body.dataset.theme,'ocean');
  assert.equal(blocked.values.has('alg0vault.web.theme'),false);
  assert.match(blocked.nodes.get('toast').textContent,/for this session/);
});
function learningContent() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'WebApp/learning-data.js'), 'utf8'), context);
  return context.window.VAULT_LEARNING;
}
function openLearning(app, id) {
  app.all.find(e => e.dataset.view === 'learning').onclick();
  if (id) {
    app.nodes.get('learningReset').onclick();
    const card = app.all.findLast(e => e.dataset.learningId === id);
    assert.ok(card, id);
    app.nodes.get('learningList').onclick({ target: card });
  }
}

test('learning bundle has all milestones, chapters, definitions and references', () => {
  const { items, anchors } = learningContent();
  assert.equal(items.length, 197);
  assert.equal(new Set(items.map(x => x.id)).size, items.length);
  assert.deepEqual(Array.from(items.filter(x => x.kind === 'week'), x => x.number), Array.from({ length: 40 }, (_, i) => i + 1));
  assert.deepEqual(Array.from(items.filter(x => x.kind === 'video'), x => x.number), Array.from({ length: 50 }, (_, i) => i + 1));
  assert.equal(items.filter(x => x.kind === 'glossary').length, 70);
  for (const item of items) {
    assert.ok(item.markdown.length > 150, item.id);
    if (item.kind === 'glossary') {
      for (const heading of ['In plain English', 'Why you use it', 'Small example', 'Common mistake', 'Check your understanding']) assert.ok(item.markdown.includes(heading), item.id);
      assert.ok(items.some(x => x.id === 'week-' + String(item.week).padStart(2, '0')));
    }
    for (const match of item.markdown.matchAll(/\]\(#([^)]+)\)/g)) assert.ok(anchors[match[1]], item.id + ': ' + match[1]);
  }
});

test('learning renderer formats code, tables and links while rejecting executable markup', () => {
  const html = learningUI.markdown('# Heading\n\n**Strong** and `string?`\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```csharp\nList<string> names = new();\n```\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert) [good](https://learn.microsoft.com/)');
  assert.match(html, /<table>/); assert.match(html, /<strong>Strong<\/strong>/);
  assert.match(html, /List&lt;string&gt;/); assert.match(html, /<pre><code>/);
  assert.doesNotMatch(html, /<img|href="javascript:/); assert.match(html, /rel="noopener noreferrer"/);
});

test('lesson fences select the actual syntax highlighter and escape unknown language labels', () => {
  const calls = [];
  const html = learningUI.markdown('```cs\npublic enum Status { Draft }\n```\n```cpp\nenum class Status { Draft };\n```\n```python\nfrom enum import Enum\n```\n```text\npublic enum is output\n```\n```<img src=x>\n<script>\n```', (code, language) => { calls.push(language); return 'highlighted'; });
  assert.deepEqual(calls, ['csharp', 'cpp', 'python']);
  assert.match(html, /learning-code-label">C\+\+/);
  assert.match(html, /&lt;img src=x&gt;/);
  assert.doesNotMatch(html, /<img|<script>/);
});

test('enum chapter and glossary contain authored implementations and language-specific failure guidance', () => {
  for (const id of ['chapter-48', 'term-enum']) {
    const item = learningContent().items.find(x => x.id === id);
    for (const language of ['csharp', 'cpp', 'python']) {
      const lesson = learningUI.lessonForLanguage(item, language);
      assert.equal(lesson.languageFallback, false);
      const blocks = [...lesson.markdown.matchAll(/```([^\n]+)\n([\s\S]*?)```/g)];
      assert.deepEqual(blocks.map(x => x[1]), [language, 'text']);
      assert.equal(blocks[1][2].trim(), 'Application submitted!\n1');
      if (language === 'csharp') assert.match(blocks[0][2], /public static void Main\(\)/);
      if (language === 'cpp') { assert.match(blocks[0][2], /enum class ApplicationStatus/); assert.doesNotMatch(blocks[0][2], /public enum|Console\./); }
      if (language === 'python') { assert.match(blocks[0][2], /class ApplicationStatus\(Enum\):/); assert.match(lesson.markdown, /ValueError/); }
    }
  }
});

test('lesson language switching preserves journal, scroll and revealed recall, and copies the displayed version', async () => {
  const app = boot(); openLearning(app, 'chapter-48');
  const journal = app.nodes.get('learningJournal');
  journal.value = 'My own enum notes'; journal.oninput({ target: journal });
  app.nodes.get('learningDetail').scrollTop = 420;
  app.nodes.get('studyRecall').onclick(); app.nodes.get('studyReveal').onclick();
  const reveal = app.nodes.get('studyReveal');
  for (const [language, syntax] of [['cpp', /ApplicationStatus::Applied/], ['python', /class.*ApplicationStatus.*Enum/], ['csharp', /public.*enum.*ApplicationStatus/]]) {
    app.nodes.get('languageSelect').onchange({ target: { value: language } });
    assert.match(app.nodes.get('learningContent').innerHTML.replace(/<[^>]*>/g, ''), syntax);
    assert.match(app.nodes.get('studyAnswer').innerHTML.replace(/<[^>]*>/g, ''), syntax);
    assert.equal(app.nodes.get('studyReveal'), reveal);
    assert.equal(reveal.disabled, true);
    assert.equal(app.nodes.get('learningJournal'), journal);
    assert.equal(app.nodes.get('learningDetail').scrollTop, 420);
    assert.equal(app.nodes.get('learningLanguageNotice').innerHTML, '');
    await app.nodes.get('learningCopy').onclick();
    assert.match(app.clipboard.at(-1), new RegExp('```' + language + '\\n'));
    assert.equal(JSON.parse(app.values.get(learningKey)).find(x => x.id === 'chapter-48').notes, 'My own enum notes');
  }
});

test('unrevealed glossary recall uses the new language when revealed and can still be graded once', () => {
  const app = boot(); openLearning(app, 'term-enum'); app.nodes.get('studyRecall').onclick();
  app.nodes.get('languageSelect').onchange({ target: { value: 'python' } });
  assert.equal(app.nodes.get('studyAnswer').innerHTML, '');
  app.nodes.get('studyReveal').onclick();
  assert.match(app.nodes.get('studyAnswer').innerHTML, /Enum/);
  assert.doesNotMatch(app.nodes.get('studyAnswer').innerHTML, /Console/);
  const grade = app.nodes.get('studyGood').onclick; grade(); grade();
  assert.equal(JSON.parse(app.values.get(learningKey)).find(x => x.id === 'term-enum').recallCount, 1);
});

test('untranslated C# lessons keep honest labels and highlight C# despite the global choice', () => {
  const app = boot(); openLearning(app, 'chapter-03');
  app.nodes.get('languageSelect').onchange({ target: { value: 'cpp' } });
  assert.match(app.nodes.get('learningLanguageNotice').innerHTML, /not available yet/);
  assert.match(app.nodes.get('learningContent').innerHTML, /learning-code-label">C#/);
  app.nodes.get('languageSelect').onchange({ target: { value: 'csharp' } });
  assert.equal(app.nodes.get('learningLanguageNotice').innerHTML, '');
  app.nodes.get('studyToday').onclick();
  assert.doesNotThrow(() => app.nodes.get('languageSelect').onchange({ target: { value: 'python' } }));
});

test('learning home opens, filters 70 glossary entries and explains encapsulation', () => {
  const app = boot(); openLearning(app);
  assert.equal(app.nodes.get('learningView').classList.contains('hidden'), false);
  assert.match(app.nodes.get('learningDetail').innerHTML, /Diagnostic/);
  app.nodes.get('learningKind').value = 'glossary'; app.nodes.get('learningKind').onchange();
  assert.equal(app.nodes.get('learningCount').textContent, '70 / 197 entries');
  app.nodes.get('learningSearch').value = 'encapsulation'; app.nodes.get('learningSearch').oninput();
  assert.equal(app.nodes.get('learningCount').textContent, '1 / 197 entries');
  assert.match(app.nodes.get('learningDetail').innerHTML.replace(/<[^>]*>/g, ''), /private set/);
  app.nodes.get('learningSearch').value = 'zzzzzzzzz'; app.nodes.get('learningSearch').oninput();
  assert.match(app.nodes.get('learningDetail').innerHTML, /No matching lessons/);
  app.nodes.get('learningReset').onclick();
  assert.match(app.nodes.get('learningDetail').innerHTML, /Your C# developer learning home/);
});

test('every learning card opens its own safely rendered content', () => {
  const app = boot(); openLearning(app);
  const cards = app.all.filter(x => x.classList.contains('learning-card'));
  assert.equal(cards.length, 197);
  for (const card of cards) {
    app.nodes.get('learningList').onclick({ target: card });
    assert.match(app.nodes.get('learningDetail').innerHTML, /learning-markdown/);
    assert.ok(app.nodes.get('learningJournal'));
  }
});

test('completion and journals persist on navigation and reload; next week advances', () => {
  const app = boot(); openLearning(app, 'week-01');
  const journal = app.nodes.get('learningJournal'); journal.value = 'I tested null and whitespace. Commit abc123.';
  journal.oninput({ target: journal });
  app.nodes.get('learningComplete').onclick();
  assert.match(app.nodes.get('learningProgress').textContent, /^1 \/ 40/);
  app.nodes.get('learningContinue').onclick();
  assert.match(app.nodes.get('learningDetail').innerHTML, /Week 2 ·/);
  const saved = JSON.parse(app.values.get(learningKey))[0];
  assert.equal(saved.notes, journal.value); assert.equal(saved.completed, true);
  const reloaded = boot(Object.fromEntries(app.values)); openLearning(reloaded, 'week-01');
  assert.match(reloaded.nodes.get('learningDetail').innerHTML, /Commit abc123/);
  reloaded.nodes.get('learningComplete').onclick();
  assert.equal(JSON.parse(reloaded.values.get(learningKey))[0].completed, false);
  reloaded.nodes.get('learningContinue').onclick();
  assert.match(reloaded.nodes.get('learningDetail').innerHTML, /Week 1 ·/);
});

test('journal draft flushes when switching to algorithms and is searchable', () => {
  const app = boot(); openLearning(app, 'chapter-01');
  const journal = app.nodes.get('learningJournal'); journal.value = 'myuniquerecall'; journal.oninput({ target: journal });
  app.all.find(e => e.dataset.view === 'algorithms').onclick();
  assert.equal(JSON.parse(app.values.get(learningKey))[0].notes, 'myuniquerecall');
  openLearning(app); app.nodes.get('learningSearch').value = 'myuniquerecall'; app.nodes.get('learningSearch').oninput();
  assert.equal(app.nodes.get('learningCount').textContent, '1 / 197 entries');
});

test('learning study threads are additive, reusable and never overwrite personal notes', () => {
  const app = boot({ [notesKey]: JSON.stringify([{ id: 'mine', title: 'Keep this', body: 'Original work', replies: [] }]) });
  openLearning(app, 'week-01'); app.nodes.get('learningStudyNote').onclick();
  assert.equal(app.nodes.get('notesView').classList.contains('hidden'), false);
  openLearning(app, 'week-01'); app.nodes.get('learningStudyNote').onclick();
  const notes = JSON.parse(app.values.get(notesKey));
  assert.equal(notes.length, 2); assert.equal(notes[1].body, 'Original work');
  assert.equal(notes[0].id, 'learning-note-week-01');
});

test('workspace export includes latest learning journal and progress', async () => {
  const app = boot(); openLearning(app, 'week-01');
  const journal = app.nodes.get('learningJournal'); journal.value = 'Unsaved timer draft'; journal.oninput({ target: journal });
  app.nodes.get('exportBackup').onclick();
  const exported = data.parseBackup(await app.downloads[0].text());
  assert.equal(exported.learning[0].notes, journal.value); assert.equal(exported.algorithms.length, 100);
});

test('learning import keeps existing IDs, adds missing progress, and accepts old backups', async () => {
  const original = data.learning([{ id: 'week-01', completed: false, notes: 'new work' }]);
  const app = boot({ [learningKey]: JSON.stringify(original) }); openLearning(app);
  async function upload(text) { await app.nodes.get('backupFile').onchange({ target: { files: [{ size: text.length, text: async () => text }], value: 'file' } }); }
  await upload(data.backup([], [], data.learning([{ id: 'week-01', completed: true, notes: 'old work' }, { id: 'week-02', completed: true }])));
  let saved = JSON.parse(app.values.get(learningKey));
  assert.equal(saved.length, 2); assert.equal(saved[0].completed, false); assert.equal(saved[0].notes, 'new work');
  await upload(data.backup([], data.notes([{ id: 'legacy', title: 'Old backup' }])));
  saved = JSON.parse(app.values.get(learningKey)); assert.equal(saved.length, 2);
  assert.ok(JSON.parse(app.values.get(notesKey)).some(x => x.id === 'legacy'));
});

test('failed third-key import rolls back original algorithms, notes and progress', async () => {
  let failed = false;
  const initial = { [key]: '[]', [notesKey]: '[]', [learningKey]: '[]' };
  const app = boot(initial, k => k === learningKey && !failed && (failed = true));
  const text = data.backup(data.algorithms([{ id: 'incoming' }]), data.notes([{ id: 'new-note' }]), data.learning([{ id: 'week-01', completed: true }]));
  await app.nodes.get('backupFile').onchange({ target: { files: [{ size: text.length, text: async () => text }], value: 'file' } });
  for (const [k, v] of Object.entries(initial)) assert.equal(app.values.get(k), v);
  assert.match(app.nodes.get('toast').textContent, /Import failed/);
});

test('corrupt learning storage stays untouched and failed writes remain exportable', async () => {
  const corrupt = boot({ [learningKey]: '{bad' }); openLearning(corrupt, 'week-01');
  corrupt.nodes.get('learningComplete').onclick();
  assert.equal(corrupt.values.get(learningKey), '{bad'); assert.equal(corrupt.nodes.get('saveStatus').dataset.state, 'error');
  const quota = boot({}, true); openLearning(quota, 'week-01'); quota.nodes.get('learningComplete').onclick();
  assert.equal(quota.values.has(learningKey), false); assert.equal(quota.nodes.get('saveStatus').dataset.state, 'error');
  quota.nodes.get('exportBackup').onclick();
  assert.equal(data.parseBackup(await quota.downloads[0].text()).learning[0].completed, true);
});

test('malformed learning backups are rejected without losing existing data', () => {
  for (const learning of [null, [null], [{ id: 'a' }, { id: 'a' }], [{ id: 7 }]]) {
    assert.throws(() => data.parseBackup(JSON.stringify({ app: 'alg0Vault', version: 1, algorithms: [], notes: [], learning })));
  }
});

test('backup roundtrip preserves code, Unicode notes, replies and review progress', () => {
  const algorithms = data.algorithms([{ id: 'a', title: 'Σ sorting', code: 'if (x < 2) return "<tag>";', masteryLevel: 'Mastered', reviewCount: 3 }]);
  const notes = data.notes([{ id: 'n', body: 'Semester α', replies: [{ content: 'A correction\nwith two lines' }] }]);
  assert.deepEqual(data.parseBackup(data.backup(algorithms, notes)), { algorithms, notes });
});
test('import is additive and never overwrites a newer existing record', () => {
  const current = [{ id: 'a', code: 'new work' }];
  assert.deepEqual(data.merge(current, [{ id: 'a', code: 'old work' }, { id: 'b' }]), [...current, { id: 'b' }]);
});
test('malformed or unrelated backups are rejected', () => {
  for (const value of ['{', '{}', '{"app":"alg0Vault","version":9}', JSON.stringify({ app: 'alg0Vault', version: 1, algorithms: [null], notes: [] })]) {
    assert.throws(() => data.parseBackup(value));
  }
});
test('normalization handles nullable values, duplicate IDs and invalid counts', () => {
  const records = data.algorithms([{ id: 'same', title: null, reviewCount: -9, difficulty: '<bad>' }, { id: 'same', masteryLevel: null }]);
  assert.equal(records[0].title, 'Untitled algorithm');
  assert.equal(records[0].reviewCount, 0);
  assert.equal(records[0].difficulty, 'Medium');
  assert.notEqual(records[0].id, records[1].id);
  assert.equal(records[1].masteryLevel, 'New');
});

function boot(initial = {}, failWrites = false, confirmResponse = true) {
  const nodes = new Map(), all = [], timers = new Map(), values = new Map(Object.entries(initial)), downloads = [], clipboard = [], confirmations = [];
  const windowEvents = new Map();
  let serial = 0;
  class Element {
    constructor(tag, attrs = {}) {
      this.tagName = tag; this.attrs = attrs; this.id = attrs.id; this.value = attrs.value || ''; this.textContent = '';
      this.dataset = Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v]));
      const classes = new Set((attrs.class || '').split(' '));
      this.classList = { contains: x => classes.has(x), add: x => classes.add(x), remove: x => classes.delete(x), toggle: (x, on) => (on ?? !classes.has(x)) ? classes.add(x) : classes.delete(x) };
      this.isContentEditable = attrs.contenteditable === 'true';
    }
    set innerHTML(html) { this.html = html; parse(html); if (this.tagName === 'select') this.value = /<option(?:\s+value="([^"]*)")?[^>]*>([^<]*)/.exec(html)?.slice(1).find(x => x !== undefined) || ''; }
    get innerHTML() { return this.html || ''; }
    setAttribute(key, value) { this.attrs[key] = value; }
    getAttribute(key) { return this.attrs[key] ?? null; }
    hasAttribute(key) { return Object.hasOwn(this.attrs,key); }
    closest(selector) { return selector.split(',').some(s => s.startsWith('[') && Object.hasOwn(this.attrs, s.slice(1, -1))) ? this : null; }
    focus() {} showModal() { this.open = true; } close() { this.open = false; }
    click() { this.onclick?.(); } append() {} remove() {}
  }
  function parse(html) {
    for (const match of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
      const attrs = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
      const element = new Element(match[1], attrs); all.push(element); if (element.id) nodes.set(element.id, element);
    }
  }
  const html = fs.readFileSync(path.join(root, 'WebApp/index.html'), 'utf8'); parse(html);
  for (const [id, value] of Object.entries({ difficultyFilter: 'Any difficulty', sortFilter: 'recent', practiceDifficulty: 'Any difficulty', practiceCategory: 'Any category', practiceMastery: 'Any mastery' })) nodes.get(id).value = value;
  const document = {
    querySelector: selector => selector === '#codePreview code' ? new Element('code') : nodes.get(selector.slice(1)) || null,
    querySelectorAll: selector => selector.startsWith('.') ? all.filter(e => e.classList.contains(selector.slice(1))) : all.filter(e => Object.hasOwn(e.attrs, selector.slice(1, -1))),
    addEventListener() {}, body: new Element('body'), createElement: tag => new Element(tag)
  };
  const context = vm.createContext({ document, console, crypto: webcrypto, navigator: { clipboard: { writeText: async text => clipboard.push(text) } }, confirm: message => { confirmations.push(message); return confirmResponse; }, alert() {}, Blob,
    URL: { createObjectURL: blob => { downloads.push(blob); return 'blob:test'; }, revokeObjectURL() {} },
    localStorage: { getItem: k => values.get(k) ?? null, setItem: (k, v) => { if (typeof failWrites === 'function' ? failWrites(k, v) : failWrites) throw new Error('Quota exceeded'); values.set(k, v); }, removeItem: k => values.delete(k) },
    setTimeout: (fn) => { timers.set(++serial, fn); return serial; }, clearTimeout: id => timers.delete(id), addEventListener(name, handler) { windowEvents.set(name, handler); }
  });
  context.window = context;
  for (const file of ['locale-data.js', 'locale.js', 'workspace-data.js', 'algorithms.js', 'algorithm-pack.js', 'language-samples.js', 'languages.js', 'local-files.js', 'patterns-data.js', 'pattern-tutorials.js', 'questions-data.js', 'patterns.js', 'learning-data.js', 'study-tools.js', 'learning.js', 'study-desk.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(root, 'WebApp', file), 'utf8'), context, { filename: file });
  return { nodes, values, all, downloads, clipboard, confirmations, windowEvents, locale: context.VaultLocale, body: document.body, flush: () => { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach(fn => fn()); } };
}

test('practice cannot resurrect an algorithm deleted from the library', () => {
  const app = boot({ [key]: JSON.stringify([{id:'one', title:'Deleted exercise'}]) });
  app.all.find(e => e.dataset.view === 'practice').onclick();
  app.all.find(e => e.dataset.view === 'algorithms').onclick();
  app.nodes.get('deleteAlgorithm').onclick();
  app.all.find(e => e.dataset.view === 'practice').onclick();
  assert.match(app.nodes.get('challengeCard').innerHTML, /No matching challenges/);
  assert.doesNotMatch(app.nodes.get('challengeCard').innerHTML, /Deleted exercise/);
});

test('returning to practice preserves a revealed valid exercise but drops one outside updated filters', () => {
  const app = boot({ [key]: JSON.stringify([{id:'one', title:'Exercise', difficulty:'Easy'}]) });
  const practice = () => app.all.find(e => e.dataset.view === 'practice').onclick();
  practice(); app.nodes.get('practiceDifficulty').value = 'Easy'; app.nodes.get('practiceDifficulty').onchange();
  app.nodes.get('revealSolution').onclick();
  app.all.find(e => e.dataset.view === 'notes').onclick(); practice();
  assert.match(app.nodes.get('challengeCard').innerHTML, /Solution revealed/);
  app.all.find(e => e.dataset.view === 'algorithms').onclick();
  const difficulty = app.nodes.get('field-difficulty'); difficulty.value = 'Hard';
  app.nodes.get('detailPane').oninput({target:difficulty});
  practice(); assert.match(app.nodes.get('challengeCard').innerHTML, /No matching challenges/);
});

test('Study Hub and Today searches include translated lesson content', () => {
  const app = boot(); openLearning(app);
  app.nodes.get('learningSearch').value = 'ValueError'; app.nodes.get('learningSearch').oninput();
  assert.match(app.nodes.get('learningList').innerHTML, /chapter-48/);
  app.nodes.get('deskSearch').value = 'ValueError'; app.nodes.get('deskSearch').oninput();
  assert.match(app.nodes.get('deskResults').innerHTML, /chapter-48/);
});

test('Notes Hub can find a thread by reply content and Today includes its semester', () => {
  const app = boot({ [notesKey]: JSON.stringify([{id:'reply-match',title:'Lecture',semester:'Semester Zeta',replies:[{content:'Semaphore discussion'}]}]) });
  app.all.find(e => e.dataset.view === 'notes').onclick();
  app.nodes.get('noteSearch').value = 'semaphore'; app.nodes.get('noteSearch').oninput();
  assert.equal(app.nodes.get('threadCount').textContent, 1);
  app.nodes.get('deskSearch').value = 'semester zeta'; app.nodes.get('deskSearch').oninput();
  assert.match(app.nodes.get('deskResults').innerHTML, /reply-match/);
});

test('unposted reply drafts warn before closing and deleting their thread clears the warning', () => {
  const app = boot({ [notesKey]: JSON.stringify([{id:'one',title:'Draft thread'}]) });
  app.all.find(e => e.dataset.view === 'notes').onclick();
  const reply = app.nodes.get('replyText'); reply.value = 'Do not lose this';
  app.nodes.get('threadDetail').oninput({target:reply});
  const unload = () => { let prevented = false; app.windowEvents.get('beforeunload')({preventDefault(){prevented=true;}}); return prevented; };
  assert.equal(unload(), true);
  app.nodes.get('deleteNote').onclick();
  assert.equal(unload(), false);
});

test('failed import recovery attempts every key and keeps unsaved session data flagged and exportable', async () => {
  let attempts = 0;
  const initial = { [key]:'[]', [notesKey]:'[]', [learningKey]:'[]' };
  const app = boot(initial, () => ++attempts >= 3);
  const text = data.backup(data.algorithms([{id:'incoming'}]), data.notes([{id:'incoming-note'}]), data.learning([{id:'week-01'}]));
  await app.nodes.get('backupFile').onchange({target:{files:[{size:text.length,text:async()=>text}],value:'file'}});
  assert.equal(attempts, 6); // Three writes and all three recovery attempts.
  assert.equal(app.nodes.get('saveStatus').dataset.state, 'error');
  let prevented = false;
  app.windowEvents.get('beforeunload')({preventDefault(){prevented=true;}});
  assert.equal(prevented, true);
  app.nodes.get('exportBackup').onclick();
  const backup = data.parseBackup(await app.downloads.at(-1).text());
  assert.deepEqual(backup.algorithms, []); assert.deepEqual(backup.notes, []);
});

test('additive import cannot create a collection that will be rejected on next startup', () => {
  const full = Array.from({length:10000}, (_,i) => ({id:String(i)}));
  assert.throws(() => data.merge(full, [{id:'overflow'}]), /10,000/);
  assert.equal(full.length, 10000);
  assert.equal(data.merge(full, [{id:'0'}]).length, 10000);
});

test('refining Study Hub search does not clear recall or replace the current journal', () => {
  const app = boot(); openLearning(app, 'chapter-48');
  const journal = app.nodes.get('learningJournal');
  journal.value = 'My explanation'; journal.oninput({target:journal});
  app.nodes.get('learningDetail').scrollTop = 260;
  app.nodes.get('studyRecall').onclick(); app.nodes.get('studyReveal').onclick();
  const reveal = app.nodes.get('studyReveal');
  app.nodes.get('learningSearch').value = 'enum'; app.nodes.get('learningSearch').oninput();
  assert.equal(app.nodes.get('learningJournal'), journal);
  assert.equal(app.nodes.get('studyReveal'), reveal);
  assert.equal(app.nodes.get('learningDetail').scrollTop, 260);
  app.nodes.get('learningSearch').value = 'nonexistent lesson'; app.nodes.get('learningSearch').oninput();
  assert.match(app.nodes.get('learningDetail').innerHTML, /No matching lessons/);
});

test('full note collections reject every new-thread entry point without losing existing records', () => {
  const initial = JSON.stringify(Array.from({length:10000}, (_,i)=>({id:'note-'+i,title:'Note '+i})));
  const app = boot({[notesKey]:initial});
  app.nodes.get('newNote').onclick();
  assert.match(app.nodes.get('toast').textContent, /10,000-record/);
  app.all.find(e=>e.dataset.view==='patterns').onclick(); app.nodes.get('patternStudyNote').onclick();
  assert.match(app.nodes.get('toast').textContent, /10,000-record/);
  openLearning(app,'week-01'); app.nodes.get('learningStudyNote').onclick();
  assert.match(app.nodes.get('toast').textContent, /10,000-record/);
  assert.equal(app.values.get(notesKey), initial);
});

test('posting or clearing the last reply draft removes the close warning', () => {
  const app = boot(); app.all.find(e=>e.dataset.view==='notes').onclick();
  function draft(text) { const reply=app.nodes.get('replyText');reply.value=text;app.nodes.get('threadDetail').oninput({target:reply}); }
  const unload = () => {let warning=false;app.windowEvents.get('beforeunload')({preventDefault(){warning=true;}});return warning;};
  draft('Not yet posted'); assert.equal(unload(),true);
  draft('   '); assert.equal(unload(),false);
  draft('Posted answer'); app.nodes.get('postReply').onclick(); assert.equal(unload(),false);
  assert.equal(JSON.parse(app.values.get(notesKey))[0].replies.at(-1).content,'Posted answer');
});
test('the real entry point starts with 100 algorithms and opens the correct panel', () => {
  const app = boot();
  assert.equal(app.nodes.get('algorithmCount').textContent, 100);
  assert.equal(app.nodes.get('homeView').classList.contains('hidden'), false);
  assert.equal(app.nodes.get('notesView').classList.contains('hidden'), true);
});
test('an intentionally empty saved library does not resurrect deleted built-ins', () => {
  const app = boot({ [key]: '[]' });
  assert.equal(app.nodes.get('algorithmCount').textContent, 0);
});
test('editing C# updates persistent data before switching pages', () => {
  const app = boot();
  const editor = app.nodes.get('codeInput'); editor.value = 'public static int Test() => 42;';
  app.nodes.get('detailPane').oninput({ target: editor }); app.flush();
  assert.equal(JSON.parse(app.values.get(key))[0].code, editor.value);
  assert.equal(app.nodes.get('saveStatus').dataset.state, 'saved');
});
test('notes editing saves independently from algorithm edits', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'notes').onclick();
  const field = app.nodes.get('note-course'); field.value = 'Discrete mathematics';
  app.nodes.get('threadDetail').oninput({ target: field }); app.flush();
  assert.equal(JSON.parse(app.values.get(notesKey))[0].course, 'Discrete mathematics');
});
test('storage quota failure is shown as unsaved and does not crash editing', () => {
  const app = boot({}, true), editor = app.nodes.get('codeInput'); editor.value = '// session draft';
  app.nodes.get('detailPane').oninput({ target: editor }); app.flush();
  assert.equal(app.nodes.get('saveStatus').dataset.state, 'error');
  assert.equal(app.values.has(key), false);
});
test('corrupt stored JSON is preserved and flagged at startup', () => {
  const app = boot({ [key]: '{bad json' });
  assert.equal(app.values.get(key), '{bad json');
  assert.equal(app.nodes.get('saveStatus').dataset.state, 'error');
});
test('every local stylesheet and script referenced by index exists', () => {
  const html = fs.readFileSync(path.join(root, 'WebApp/index.html'), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"#]+\.(?:js|css|png))"/g)) assert.ok(fs.existsSync(path.resolve(root, 'WebApp', match[1])), match[1]);
});

test('all categories remain available, including prototype-like names', () => {
  const app = boot({ [key]: JSON.stringify([{ id: 'a', category: '__proto__' }]) });
  assert.match(app.nodes.get('categories').innerHTML, /__proto__/);
  assert.match(app.nodes.get('practiceCategory').innerHTML, /__proto__/);
});

test('switching pages flushes an algorithm draft without waiting for the timer', () => {
  const app = boot(), editor = app.nodes.get('codeInput'); editor.value = '// unsaved draft';
  app.nodes.get('detailPane').oninput({ target: editor });
  app.all.find(e => e.dataset.view === 'notes').onclick();
  assert.equal(JSON.parse(app.values.get(key))[0].code, editor.value);
});

test('stale semester filters reset after a semester disappears', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'notes').onclick();
  app.nodes.get('semesterFilter').value = 'Removed semester';
  app.nodes.get('semesterFilter').onchange();
  assert.equal(app.nodes.get('threadCount').textContent, 1);
  assert.equal(app.nodes.get('semesterFilter').value, '');
});

test('an empty practice pool shows a useful empty state', () => {
  const app = boot({ [key]: '[]' });
  app.all.find(e => e.dataset.view === 'practice').onclick();
  assert.match(app.nodes.get('challengeCard').innerHTML, /No matching challenges/);
});

test('untrusted C# markup is escaped in the preview', () => {
  const app = boot({ [key]: JSON.stringify([{ id: 'a', code: '<img src=x onerror=alert(1)>' }]) });
  assert.doesNotMatch(app.nodes.get('codePreview').innerHTML, /<img/);
  assert.match(app.nodes.get('detailPane').innerHTML, /&lt;img/);
});

test('patterns opens its own panel with 24 guides and a solving roadmap', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  assert.equal(app.nodes.get('patternsView').classList.contains('hidden'), false);
  assert.equal(app.nodes.get('algorithmView').classList.contains('hidden'), true);
  assert.equal(app.nodes.get('patternCount').textContent, '24 / 24 patterns');
  assert.match(app.nodes.get('patternDetail').innerHTML, /Solving recipe/);
  assert.match(app.nodes.get('patternDetail').innerHTML, /New question/);
});

test('pattern search matches practice questions and handles no results', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  app.nodes.get('patternSearch').value = 'Coin Change'; app.nodes.get('patternSearch').oninput();
  assert.equal(app.nodes.get('patternCount').textContent, '1 / 24 patterns');
  assert.match(app.nodes.get('patternDetail').innerHTML, /House Robber/);
  app.nodes.get('patternSearch').value = 'zzzzzz'; app.nodes.get('patternSearch').oninput();
  assert.equal(app.nodes.get('patternCount').textContent, '0 / 24 patterns');
  assert.match(app.nodes.get('patternDetail').innerHTML, /No matching patterns/);
  app.nodes.get('resetPatterns').onclick();
  assert.equal(app.nodes.get('patternCount').textContent, '24 / 24 patterns');
});

test('pattern family filter and related pattern navigation work', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  app.nodes.get('patternGroup').value = 'Trees & graphs'; app.nodes.get('patternGroup').onchange();
  assert.equal(app.nodes.get('patternCount').textContent, '6 / 24 patterns');
  assert.match(app.nodes.get('patternDetail').innerHTML, /Tree DFS/);
  const link = app.all.find(e => e.dataset.relatedPattern === 'backtracking');
  app.nodes.get('patternDetail').onclick({ target: link });
  assert.match(app.nodes.get('patternDetail').innerHTML, /choose, explore, undo/);
  assert.equal(app.nodes.get('patternGroup').value, '');
});

test('a pattern study thread preserves existing notes and includes question outlines', () => {
  const app = boot({ [notesKey]: JSON.stringify([{ id: 'personal', title: 'Keep me', body: 'Private notes', replies: [] }]) });
  app.all.find(e => e.dataset.view === 'patterns').onclick();
  app.nodes.get('patternStudyNote').onclick();
  const notes = JSON.parse(app.values.get(notesKey));
  assert.equal(notes.length, 2);
  assert.equal(notes[1].body, 'Private notes');
  assert.match(notes[0].body, /Minimum Window Substring/);
  assert.match(notes[0].body, /Correctness invariant/);
  assert.equal(app.nodes.get('notesView').classList.contains('hidden'), false);
});

test('all pattern guides have complete content and valid cross references', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'WebApp/patterns-data.js'), 'utf8'), context);
  const patterns = context.window.ALG0_PATTERNS, ids = new Set(patterns.map(p => p.id));
  assert.equal(ids.size, 24);
  assert.equal(patterns.reduce((n, p) => n + p.practice.length, 0), 102);
  assert.equal(new Set(patterns.flatMap(p => p.practice.map(q => q.title))).size, 100);
  for (const p of patterns) {
    for (const field of ['title', 'group', 'cue', 'idea', 'invariant', 'example', 'complexity', 'code', 'tests']) assert.ok(p[field]?.length, p.id + ':' + field);
    assert.ok(p.steps.length >= 4 && p.pitfalls.length >= 3);
    for (const q of p.practice) assert.ok(q.title && q.approach.length > 25);
    for (const id of p.next) assert.ok(ids.has(id), id);
  }
});

test('every pattern card renders its own template and practice outlines', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  const cards = app.all.filter(e => e.dataset.pattern);
  assert.equal(cards.length, 24);
  for (const card of cards) {
    app.nodes.get('patternList').onclick({ target: card });
    assert.match(app.nodes.get('patternDetail').innerHTML, /C# reference template/);
    assert.match(app.nodes.get('patternDetail').innerHTML, /Apply it to real questions/);
    assert.ok(app.nodes.get('copyPatternCode').onclick);
    assert.ok(app.nodes.get('patternStudyNote').onclick);
  }
});

const commentFixture = () => JSON.stringify([
  { id: 'n1', title: 'First thread', body: 'Keep the main note', replies: [
    { author: 'You', content: 'Duplicate text' }, { author: 'You', content: 'Duplicate text' },
    { author: 'You', content: 'Last comment' }
  ] },
  { id: 'n2', title: 'Other thread', body: 'Other note', replies: [{ content: 'Keep this too' }] }
]);

test('deleting a comment persists only that comment removal and preserves drafts', () => {
  const app = boot({ [notesKey]: commentFixture() });
  app.all.find(e => e.dataset.view === 'notes').onclick();
  const draft = app.nodes.get('replyText'); draft.value = 'Unposted draft';
  app.nodes.get('threadDetail').oninput({ target: draft });
  const button = app.all.find(e => e.dataset.deleteReply === '1');
  app.nodes.get('threadDetail').onclick({ target: button });
  const notes = JSON.parse(app.values.get(notesKey));
  assert.deepEqual(notes[0].replies.map(r => r.content), ['Duplicate text', 'Last comment']);
  assert.equal(notes[0].body, 'Keep the main note');
  assert.equal(notes[1].replies[0].content, 'Keep this too');
  assert.match(app.nodes.get('threadDetail').innerHTML, /Unposted draft/);
  assert.match(app.nodes.get('threadDetail').innerHTML, /2 replies/);
});

test('cancelling comment deletion leaves storage untouched', () => {
  const original = commentFixture(), app = boot({ [notesKey]: original }, false, false);
  app.all.find(e => e.dataset.view === 'notes').onclick();
  app.nodes.get('threadDetail').onclick({ target: app.all.find(e => e.dataset.deleteReply === '0') });
  assert.equal(app.values.get(notesKey), original);
  assert.match(app.nodes.get('threadDetail').innerHTML, /3 replies/);
});

test('comment deletion rolls back in memory when storage fails', () => {
  const original = commentFixture(), app = boot({ [notesKey]: original }, true);
  app.all.find(e => e.dataset.view === 'notes').onclick();
  app.nodes.get('threadDetail').onclick({ target: app.all.find(e => e.dataset.deleteReply === '0') });
  assert.equal(app.values.get(notesKey), original);
  assert.match(app.nodes.get('threadDetail').innerHTML, /3 replies/);
  assert.equal(app.nodes.get('toast').textContent, 'Comment was not deleted because saving failed.');
});

test('question bank contains exactly 100 unique briefs and valid pattern links', () => {
  const context = { window: {} };
  for (const file of ['patterns-data.js', 'questions-data.js']) vm.runInNewContext(fs.readFileSync(path.join(root, 'WebApp', file), 'utf8'), context);
  const questions = context.window.ALG0_QUESTIONS, patterns = context.window.ALG0_PATTERNS;
  assert.equal(questions.length, 100);
  assert.equal(new Set(questions.map(q => q.title)).size, 100);
  assert.equal(new Set(questions.map(q => q.id)).size, 100);
  for (const q of questions) {
    assert.ok(q.brief.length > 40 && q.guides.length > 0, q.title);
    for (const g of q.guides) {
      const pattern = patterns.find(p => p.id === g.pattern);
      assert.ok(pattern.practice.some(p => p.title === q.title && p.approach === g.approach), q.title);
    }
  }
});

test('100-question browsing, search, empty state, and related template navigation work', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  app.nodes.get('browseQuestions').onclick();
  assert.equal(app.nodes.get('patternCount').textContent, '100 / 100 questions');
  assert.match(app.nodes.get('patternDetail').innerHTML, /The question/);
  app.nodes.get('patternSearch').value = 'Decode Ways'; app.nodes.get('patternSearch').oninput();
  assert.equal(app.nodes.get('patternCount').textContent, '1 / 100 questions');
  assert.match(app.nodes.get('patternDetail').innerHTML, /standalone zero/);
  app.nodes.get('patternSearch').value = 'zzzzzz'; app.nodes.get('patternSearch').oninput();
  assert.match(app.nodes.get('patternDetail').innerHTML, /No matching questions/);
  app.nodes.get('resetPatterns').onclick();
  assert.equal(app.nodes.get('patternCount').textContent, '100 / 100 questions');
  const link = app.all.filter(e => e.dataset.relatedPattern === 'sliding-window').at(-1);
  app.nodes.get('patternDetail').onclick({ target: link });
  assert.equal(app.nodes.get('browsePatterns').attrs['aria-pressed'], 'true');
  assert.match(app.nodes.get('patternDetail').innerHTML, /Solving recipe/);
});

test('every question card opens its brief and family filtering works', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  app.nodes.get('browseQuestions').onclick();
  const cards = app.all.filter(e => e.dataset.question);
  assert.equal(cards.length, 100);
  for (const card of cards) {
    app.nodes.get('patternList').onclick({ target: card });
    assert.match(app.nodes.get('patternDetail').innerHTML, /The question/);
    assert.match(app.nodes.get('patternDetail').innerHTML, /Hints &amp; related templates/);
  }
  app.nodes.get('patternGroup').value = 'Trees & graphs'; app.nodes.get('patternGroup').onchange();
  const visibleCount = Number(app.nodes.get('patternCount').textContent.split(' ')[0]);
  assert.ok(visibleCount > 0 && visibleCount < 100);
});

test('guided tutorials cover every pattern with valid self-checks', () => {
  const context = { window: {} };
  for (const file of ['patterns-data.js', 'pattern-tutorials.js']) vm.runInNewContext(fs.readFileSync(path.join(root, 'WebApp', file), 'utf8'), context);
  const tutorials = context.window.ALG0_TUTORIALS;
  assert.equal(Object.keys(tutorials).length, 24);
  for (const p of context.window.ALG0_PATTERNS) {
    const t = tutorials[p.id];
    assert.ok(t.definition.length > 40 && t.state.length > 20, p.id);
    assert.equal(t.walkthrough.length, 3);
    assert.ok(t.walkthrough.every(step => step.length > 35));
    assert.ok(t.answer >= 0 && t.answer < t.options.length);
    assert.ok(t.question && t.explanation.length > 40);
  }
});

test('tutorial step controls stay within bounds and preserve state on navigation', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  assert.equal(app.nodes.get('tutorialPosition').textContent, 'Step 1 of 3');
  assert.equal(app.nodes.get('tutorialPrevious').disabled, true);
  app.nodes.get('tutorialNext').onclick(); app.nodes.get('tutorialNext').onclick(); app.nodes.get('tutorialNext').onclick();
  assert.equal(app.nodes.get('tutorialPosition').textContent, 'Step 3 of 3');
  assert.equal(app.nodes.get('tutorialNext').disabled, true);
  const first = app.all.findLast(e => e.dataset.pattern === 'sliding-window');
  const second = app.all.findLast(e => e.dataset.pattern === 'fixed-window');
  app.nodes.get('patternList').onclick({ target: second });
  assert.equal(app.nodes.get('tutorialPosition').textContent, 'Step 1 of 3');
  app.nodes.get('patternList').onclick({ target: first });
  assert.equal(app.nodes.get('tutorialPosition').textContent, 'Step 3 of 3');
  for (let i = 0; i < 5; i++) app.nodes.get('tutorialPrevious').onclick();
  assert.equal(app.nodes.get('tutorialPosition').textContent, 'Step 1 of 3');
});

test('tutorial feedback explains correct and incorrect answers without modifying saved data', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  const before = Object.fromEntries(app.values);
  const wrong = app.all.findLast(e => e.dataset.tutorialAnswer === '0');
  const right = app.all.findLast(e => e.dataset.tutorialAnswer === '1');
  app.nodes.get('patternDetail').onclick({ target: wrong });
  assert.match(app.nodes.get('tutorialFeedback').textContent, /Not quite/);
  app.nodes.get('patternDetail').onclick({ target: right });
  assert.match(app.nodes.get('tutorialFeedback').textContent, /Correct/);
  assert.match(app.nodes.get('tutorialFeedback').textContent, /negative/);
  assert.equal(right.attrs['aria-pressed'], 'true');
  assert.deepEqual(Object.fromEntries(app.values), before);
});

test('search preserves an unchanged lesson DOM and tutorial position', () => {
  const app = boot(); app.all.find(e => e.dataset.view === 'patterns').onclick();
  app.nodes.get('tutorialNext').onclick();
  const frame = app.nodes.get('tutorialFrame');
  const copyButton = app.nodes.get('copyPatternCode');
  app.nodes.get('patternDetail').scrollTop = 240;
  app.nodes.get('patternSearch').value = 'sliding'; app.nodes.get('patternSearch').oninput();
  assert.equal(app.nodes.get('tutorialFrame'), frame);
  assert.equal(app.nodes.get('copyPatternCode'), copyButton);
  assert.equal(app.nodes.get('patternDetail').scrollTop, 240);
  assert.equal(app.nodes.get('tutorialPosition').textContent, 'Step 2 of 3');
  app.nodes.get('browseQuestions').onclick();
  assert.match(app.nodes.get('patternDetail').innerHTML, /The question/);
  app.nodes.get('browsePatterns').onclick();
  assert.match(app.nodes.get('patternDetail').innerHTML, /Guided tutorial/);
});

function chooseLanguage(app, language) {
  app.nodes.get('languageSelect').onchange({ target: { value: language } });
}

test('English/Polish interface switch persists independently from programming language and theme', () => {
  const app = boot();
  assert.equal(app.locale.getLocale(),'en');
  chooseLanguage(app,'python');
  app.nodes.get('themeSelect').onchange({target:{value:'Purple'}});
  app.nodes.get('localePolish').onclick();
  assert.equal(app.locale.getLocale(),'pl');
  assert.equal(app.values.get('alg0vault.web.locale.v1'),'pl');
  assert.equal(app.nodes.get('newAlgorithm').textContent,'＋ Nowy algorytm');
  assert.equal(app.nodes.get('saveWorkspaceFile').textContent,'Zapisz plik');
  assert.equal(app.nodes.get('localePolish').attrs['aria-pressed'],'true');
  assert.equal(app.nodes.get('languageSelect').value,'python');
  assert.equal(app.nodes.get('themeSelect').value,'Purple');
  const restored = boot(Object.fromEntries(app.values));
  assert.equal(restored.locale.getLocale(),'pl');
  assert.equal(restored.nodes.get('newAlgorithm').textContent,'＋ Nowy algorytm');
  restored.nodes.get('localeEnglish').onclick();
  assert.equal(restored.nodes.get('newAlgorithm').textContent,'＋ New algorithm');
  assert.equal(restored.nodes.get('saveWorkspaceFile').textContent,'Save file');
});

test('locale switching preserves live code and reply drafts, notes and filter values', async () => {
  const original = {[key]:JSON.stringify([{id:'mine',title:'Save changes',category:'Arrays',code:'// Delete',implementations:{python:'print("Save file")'}}]),
    [notesKey]:JSON.stringify([{id:'thread',title:'Delete',course:'Save file',body:'Today',replies:[{author:'English',content:'Save changes'}]}])};
  const app = boot(original);
  const editor = app.nodes.get('codeInput'); editor.value='// Unsaved draft';
  app.nodes.get('detailPane').oninput({target:editor});
  app.nodes.get('difficultyFilter').value='Easy';
  app.nodes.get('localePolish').onclick();
  assert.strictEqual(app.nodes.get('codeInput'),editor);
  assert.equal(editor.value,'// Unsaved draft');
  assert.equal(app.nodes.get('difficultyFilter').value,'Easy');
  assert.equal(app.values.get(notesKey),original[notesKey]);
  app.all.find(e=>e.dataset.view==='notes').onclick();
  const reply=app.nodes.get('replyText'); reply.value='My unposted answer';
  app.nodes.get('threadDetail').oninput({target:reply});
  app.nodes.get('localeEnglish').onclick();
  assert.strictEqual(app.nodes.get('replyText'),reply);
  assert.equal(reply.value,'My unposted answer');
  assert.equal(app.values.get(notesKey),original[notesKey]);
  assert.equal(JSON.parse(app.values.get(key))[0].code,'// Unsaved draft');
  assert.equal(JSON.parse(app.values.get(key))[0].title,'Save changes');
});

test('live interface messages translate new English updates and restore on switching back', () => {
  const app=boot();
  app.nodes.get('resultCount').textContent='17 items';
  app.nodes.get('localePolish').onclick();
  assert.equal(app.nodes.get('resultCount').textContent,'Liczba pozycji: 17');
  app.nodes.get('resultCount').textContent='1 item'; app.locale.render();
  assert.equal(app.nodes.get('resultCount').textContent,'Liczba pozycji: 1');
  app.nodes.get('localeEnglish').onclick();
  assert.equal(app.nodes.get('resultCount').textContent,'1 item');
  app.nodes.get('focusToggle').textContent='Pause';app.nodes.get('localePolish').onclick();
  assert.equal(app.nodes.get('focusToggle').textContent,'Pauza');
  app.nodes.get('localeEnglish').onclick();
  assert.equal(app.nodes.get('focusToggle').textContent,'Pause');
});

test('locale preference has safe fallback and unavailable storage does not block switching', () => {
  assert.equal(boot({'alg0vault.web.locale.v1':'__proto__'}).locale.getLocale(),'en');
  const app=boot({},true);
  app.nodes.get('localePolish').onclick();
  assert.equal(app.nodes.get('newAlgorithm').textContent,'＋ Nowy algorytm');
  assert.match(app.nodes.get('localeStatus').textContent,/tylko w tej sesji/);
  assert.equal(app.values.has('alg0vault.web.locale.v1'),false);
  assert.equal(app.locale.setLocale('javascript:alert(1)'),false);
  assert.equal(app.locale.getLocale(),'pl');
});

test('Polish import confirmation still cancels safely without modifying study data', async () => {
  const initial={[key]:'[]',[notesKey]:'[]',[learningKey]:'[]'};
  const app=boot(initial,false,false);app.locale.setLocale('pl');
  const text=data.backup(data.algorithms([{id:'incoming',title:'Do not import'}]),[]);
  await app.nodes.get('backupFile').onchange({target:{files:[{size:text.length,text:async()=>text}],value:'backup.json'}});
  assert.equal(app.confirmations.at(-1),'Zaimportować nowe wpisy (1)? Istniejące wpisy o tych samych identyfikatorach zostaną zachowane.');
  for(const [store,value] of Object.entries(initial))assert.equal(app.values.get(store),value);
});

test('Polish deletion prompt preserves the actual user title and respects cancellation', () => {
  const rows=JSON.stringify([{id:'mine',title:'Save changes <custom>',code:'// unchanged'}]);
  const app=boot({[key]:rows},false,false);app.locale.setLocale('pl');
  app.nodes.get('deleteAlgorithm').onclick();
  assert.equal(app.confirmations.at(-1),'Usunąć „Save changes <custom>”?');
  assert.equal(app.values.get(key),rows);
});

test('UI translation markers all resolve and localized select options retain stable values', () => {
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'WebApp/locale-data.js'),'utf8'),context);
  const table=context.window.ALG0_UI_TRANSLATIONS;
  for (const file of ['index.html','app.js','patterns.js','learning.js','study-tools.js','study-desk.js']) {
    const source=fs.readFileSync(path.join(root,'WebApp',file),'utf8');
    for (const match of source.matchAll(/data-i18n(?:-placeholder|-aria-label|-title)?="(ui\d+)"/g))
      assert.ok(table[match[1]]?.every(x=>typeof x==='string'&&x.length),file+': '+match[1]);
    for (const match of source.matchAll(/<option\b([^>]*data-i18n[^>]*)>/g))
      assert.match(match[1],/value="/,file+': missing stable option value');
  }
  const app=boot();app.locale.setLocale('pl');
  assert.equal(app.locale.t('Delete “<img src=x>”?”'),'Delete “<img src=x>”?”');
  assert.equal(app.locale.t('Step 2 of 5'),'Krok 2 z 5');
  assert.equal(app.locale.t('A custom personal note'),'A custom personal note');
});

test('language defaults to C# and restores only known preferences', () => {
  assert.equal(boot().nodes.get('languageSelect').value, 'csharp');
  assert.equal(boot({ 'alg0vault.web.language.v1': 'python' }).nodes.get('languageSelect').value, 'python');
  assert.equal(boot({ 'alg0vault.web.language.v1': '__proto__' }).nodes.get('languageSelect').value, 'csharp');
});

test('language switching preserves independent code drafts through reload and backup', async () => {
  const app = boot({ [key]: JSON.stringify([{ id: 'mine', code: '// Original C#' }]) });
  const edit = text => { const editor=app.nodes.get('codeInput'); editor.value=text; app.nodes.get('detailPane').oninput({target:editor}); };
  edit('// Edited C#'); chooseLanguage(app,'python');
  assert.match(app.nodes.get('detailPane').innerHTML, /No built-in Python version/);
  assert.doesNotMatch(app.nodes.get('detailPane').innerHTML, /Edited C#/);
  edit('def solve():\n    return 42'); chooseLanguage(app,'cpp');
  edit('int solve() { return 7; }'); chooseLanguage(app,'csharp');
  const saved = JSON.parse(app.values.get(key))[0];
  assert.equal(saved.code,'// Edited C#');
  assert.equal(saved.implementations.python,'def solve():\n    return 42');
  assert.equal(saved.implementations.cpp,'int solve() { return 7; }');
  const restored = boot(Object.fromEntries(app.values)); chooseLanguage(restored,'python');
  assert.match(restored.nodes.get('detailPane').innerHTML,/def solve/);
  app.nodes.get('exportBackup').onclick();
  const exported = data.parseBackup(await app.downloads.at(-1).text());
  assert.deepEqual(exported.algorithms[0].implementations,saved.implementations);
});

test('built-in references appear in the chosen language and an intentional blank stays blank', () => {
  const app=boot(); chooseLanguage(app,'python');
  assert.match(app.nodes.get('detailPane').innerHTML,/binary_search/);
  assert.match(app.nodes.get('detailPane').innerHTML,/Built-in Python reference/);
  const editor=app.nodes.get('codeInput'); editor.value='';
  app.nodes.get('detailPane').oninput({target:editor}); chooseLanguage(app,'cpp'); chooseLanguage(app,'python');
  assert.doesNotMatch(app.nodes.get('detailPane').innerHTML,/binary_search/);
  assert.equal(JSON.parse(app.values.get(key))[0].implementations.python,'');
});

test('all 24 pattern templates switch without stale C# cache content', () => {
  const app=boot(); app.all.find(e=>e.dataset.view==='patterns').onclick();
  const cards=app.all.filter(e=>e.dataset.pattern);
  for(const language of ['python','cpp','csharp']) {
    chooseLanguage(app,language);
    for(const card of cards) {
      app.nodes.get('patternList').onclick({target:card});
      const html=app.nodes.get('patternDetail').innerHTML;
      assert.match(html,new RegExp(language==='python'?'Python reference template':language==='cpp'?'C\\+\\+ reference template':'C# reference template'));
      if(language!=='csharp') assert.doesNotMatch(html,/public class Solution/);
      assert.ok(app.nodes.get('tutorialNext').onclick);
    }
  }
});

test('revealed practice solutions keep their reveal state when switching language', () => {
  const app=boot({[key]:JSON.stringify([{id:'mine',code:'// CS',implementations:{python:'def custom(): pass',cpp:'int custom() { return 0; }'}}])});
  app.all.find(e=>e.dataset.view==='practice').onclick(); app.nodes.get('revealSolution').onclick();
  chooseLanguage(app,'python');
  assert.match(app.nodes.get('challengeCard').innerHTML,/custom/);
  assert.match(app.nodes.get('challengeCard').innerHTML,/Solution revealed/);
  assert.doesNotMatch(app.nodes.get('challengeCard').innerHTML,/\/\/ CS/);
});

test('save files restore language and independent implementations; old files use C#', async () => {
  const app=boot();
  await openSnapshot(app,{algorithms:[{id:'saved',code:'// C#',implementations:{python:'print(42)'}}],notes:[],settings:{theme:'Ocean',language:'python'}});
  assert.equal(app.nodes.get('languageSelect').value,'python');
  assert.match(app.nodes.get('detailPane').innerHTML,/print/);
  assert.equal(app.values.get('alg0vault.web.language.v1'),'python');
  await app.nodes.get('saveWorkspaceFile').onclick();
  const saved=JSON.parse(await app.downloads.at(-1).text());
  assert.equal(saved.settings.language,'python');
  assert.equal(saved.algorithms[0].implementations.python,'print(42)');
  await openSnapshot(app,{algorithms:[],notes:[]});
  assert.equal(app.nodes.get('languageSelect').value,'csharp');
});

test('unsupported language content is rejected and quota failures preserve in-memory drafts', () => {
  for(const implementations of [null, [], {javascript:'alert(1)'}, {python:3}])
    assert.throws(()=>data.algorithms([{id:'bad',implementations}]));
  const app=boot({[key]:JSON.stringify([{id:'mine',code:'// C#'}])},true);
  chooseLanguage(app,'python'); const editor=app.nodes.get('codeInput');editor.value='print(9)';
  app.nodes.get('detailPane').oninput({target:editor}); chooseLanguage(app,'csharp');chooseLanguage(app,'python');
  assert.match(app.nodes.get('detailPane').innerHTML,/print/);
  assert.equal(JSON.parse(app.values.get(key))[0].code,'// C#');
  assert.equal(app.nodes.get('saveStatus').dataset.state,'error');
});

test('syntax highlighting recognizes Python and C++ without interpreting user markup', () => {
  const languages=require('../WebApp/languages.js');
  assert.match(languages.highlight('def f():\n    return True # comment','python'),/<span class="kw">def<\/span>/);
  assert.match(languages.highlight('# comment','python'),/<span class="com">/);
  assert.doesNotMatch(languages.highlight('x // 2','python'),/class="com"/);
  assert.match(languages.highlight('nullptr // comment','cpp'),/<span class="kw">nullptr/);
  assert.match(languages.highlight('<script>alert(1)</script>','cpp'),/&lt;script&gt;/);
  assert.doesNotMatch(languages.highlight('<script>alert(1)</script>','cpp'),/<script>/);
});

test('copy uses the visible language in both the editor and pattern templates', async () => {
  const app=boot({[key]:JSON.stringify([{id:'mine',code:'// original',implementations:{python:'print(17)'}}])});
  chooseLanguage(app,'python'); await app.nodes.get('copyCode').onclick();
  assert.equal(app.clipboard.at(-1),'print(17)');
  app.all.find(e=>e.dataset.view==='patterns').onclick(); await app.nodes.get('copyPatternCode').onclick();
  assert.match(app.clipboard.at(-1),/def longest_unique/);
  chooseLanguage(app,'cpp'); await app.nodes.get('copyPatternCode').onclick();
  assert.match(app.clipboard.at(-1),/#include <unordered_set>/);
  assert.doesNotMatch(app.clipboard.at(-1),/public class Solution/);
});

test('library language references cover all 100 stable built-in IDs', () => {
  const context={window:{}};
  for(const file of ['algorithms.js','algorithm-pack.js','language-samples.js','languages.js'])
    vm.runInNewContext(fs.readFileSync(path.join(root,'WebApp',file),'utf8'),context);
  const languages=context.window.VaultLanguages;
  for(const lang of ['python','cpp']) {
    const covered=context.window.ALG0_ALGORITHMS.filter(a=>languages.get(a,lang).source==='reference');
    assert.equal(covered.length,100);
    for(const a of covered) assert.ok(languages.get(a,lang).code.length>60);
    assert.equal(languages.get({id:'custom',title:'Binary Search',code:'// mine'},lang).source,'missing');
  }
});

test('every bundled algorithm renders and copies its selected language without changing C#', async () => {
  const context = { window: {} };
  for (const file of ['algorithms.js','algorithm-pack.js'])
    vm.runInNewContext(fs.readFileSync(path.join(root,'WebApp',file),'utf8'),context);
  const app = boot({ [key]: JSON.stringify(context.window.ALG0_ALGORITHMS) });
  const originals = JSON.parse(app.values.get(key));
  app.all.find(e => e.dataset.view === 'algorithms').onclick();
  for (const language of ['python', 'cpp']) {
    chooseLanguage(app, language);
    for (const original of originals) {
      const card = app.all.findLast(e => e.dataset.id === original.id);
      assert.ok(card, original.title);
      app.nodes.get('algorithmList').onclick({ target: card });
      const html = app.nodes.get('detailPane').innerHTML;
      assert.doesNotMatch(html, /No built-in/);
      await app.nodes.get('copyCode').onclick();
      const copied = app.clipboard.at(-1);
      assert.match(copied, language === 'python' ? /^# Python 3 reference/ : /^\/\/ C\+\+17 reference/);
      if (copied.includes('checkedAdd(')) assert.match(copied, /inline long long checkedAdd\(/);
      if (copied.includes('checkedMultiply(')) assert.match(copied, /inline long long checkedMultiply\(/);
    }
  }
  assert.deepEqual(JSON.parse(app.values.get(key)).map(a => a.code), originals.map(a => a.code));
});

test('complete language catalog retains overrides and stable-ID lookup after renaming', () => {
  const context = { window: {} };
  for (const file of ['algorithms.js','algorithm-pack.js','language-samples.js','languages.js'])
    vm.runInNewContext(fs.readFileSync(path.join(root,'WebApp',file),'utf8'),context);
  const { ALG0_ALGORITHMS: catalog, VaultLanguages: languages } = context.window;
  for (const original of catalog) {
    const renamed = { ...original, title: 'My renamed algorithm' };
    for (const language of ['python','cpp']) {
      assert.equal(languages.get(renamed,language).code,languages.get(original,language).code);
      const custom = { ...renamed, implementations: { [language]: '// my own work' } };
      assert.equal(languages.get(custom,language).code,'// my own work');
      assert.equal(languages.get(custom,'csharp').code,original.code);
    }
  }
});

test('the app starts without the removed AI prompt feature', () => {
  const app = boot();
  assert.equal(app.nodes.has('openPrompt'), false);
  assert.equal(app.nodes.has('promptDialog'), false);
  for (const file of ['PROFESSIONAL_PROGRAMMER_PROMPT.md', 'PromptWindow.xaml', 'PromptWindow.xaml.cs', 'CONTRIBUTING.md', 'SECURITY.md', 'CHANGELOG.md'])
    assert.equal(fs.existsSync(path.join(root, file)), false, file);
});
