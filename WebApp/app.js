(()=>{
  const t = text => VaultLocale.t(text);
  const confirm = message => window.confirm(t(message));
  const alert = message => window.alert(t(message));
  const BUILT_INS=window.ALG0_ALGORITHMS||[];
  const KEY='alg0vault.web.algorithms.v1', NOTES_KEY='alg0vault.web.notes.v1', THEME_KEY='alg0vault.web.theme';
  const LEARNING_KEY='alg0vault.web.learning.v1', LANGUAGE_KEY='alg0vault.web.language.v1';
  let currentLanguage = 'csharp', practiceRevealed = false;
  try { const saved = localStorage.getItem(LANGUAGE_KEY); if (VaultLanguages.valid(saved)) currentLanguage = saved; } catch { /* Session preference still works without storage. */ }
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;
  const blockedStores = new Set();
  const dirtyStores = new Set();
  const replyDrafts = new Map();
  let saveTimer, fileTools;
  function setSaveStatus(message, state = '') {
    $('#saveStatus').textContent = message;
    $('#saveStatus').dataset.state = state;
  }
  function loadCollection(key, fallback, normalize) {
    try {
      const raw = localStorage.getItem(key);
      return normalize(raw === null ? fallback : JSON.parse(raw));
    } catch (error) {
      blockedStores.add(key);
      setSaveStatus('Storage needs attention — export before closing', 'error');
      return normalize(fallback);
    }
  }
  // A saved collection is authoritative: intentionally deleted built-ins stay deleted.
  const initialAlgorithms=()=>loadCollection(KEY, BUILT_INS, VaultData.algorithms);
  let algorithms=initialAlgorithms(), selectedId=algorithms[0]?.id, currentView='algorithms', categoryFilter='', favoritesOnly=false, practiceCurrent=null;
  let notes=loadCollection(NOTES_KEY,[{id:uid(),title:'Welcome to your Notes Hub',course:'General',semester:'Getting Started',body:'Use threads to organize lecture notes, study guides, exam preparation, project material, and useful discussions.',pinned:true,updatedAt:new Date().toISOString(),replies:[{author:'alg0Vault',content:'Tip: create one thread per topic, then use replies for corrections, questions, summaries, and updates.',createdAt:new Date().toISOString()}]}], VaultData.notes), selectedNoteId=notes[0]?.id;
  function writeCollection(key, value) {
    fileTools?.refresh();
    try {
      if (blockedStores.has(key)) throw new Error('Existing storage could not be read. Export your current session before closing; the original stored value has been preserved.');
      localStorage.setItem(key, JSON.stringify(value));
      dirtyStores.delete(key);
      if (!dirtyStores.size && !blockedStores.size) setSaveStatus('Saved in browser', 'saved');
      return true;
    } catch (error) {
      dirtyStores.add(key);
      setSaveStatus('Not saved — export a backup', 'error');
      toast(error.message || 'Browser storage is full or unavailable. Export a backup now.');
      return false;
    }
  }
  const saveAlgorithms=()=>writeCollection(KEY, algorithms);
  const saveNotes=()=>writeCollection(NOTES_KEY, notes);
  let learningProgress=loadCollection(LEARNING_KEY, [], VaultData.learning);
  const saveLearning=()=>writeCollection(LEARNING_KEY, learningProgress);
  function queueSave(key) {
    fileTools?.refresh();
    dirtyStores.add(key);
    setSaveStatus('Saving…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSaves, 450);
  }
  function flushSaves() {
    clearTimeout(saveTimer);
    if (dirtyStores.has(KEY)) saveAlgorithms();
    if (dirtyStores.has(NOTES_KEY)) saveNotes();
    if (dirtyStores.has(LEARNING_KEY)) saveLearning();
  }
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const highlight = (code, language = 'csharp') => VaultLanguages.highlight(code, language);
  const now=()=>new Date().toISOString(); const toast=message=>{const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};
  function persistAndRender(message){const saved=saveAlgorithms();renderAll();if(message&&saved)toast(message)}
  function stats(){ $('#algorithmCount').textContent=algorithms.length;$('#totalStat').textContent=algorithms.length;$('#masteredStat').textContent=algorithms.filter(x=>x.masteryLevel==='Mastered').length;$('#reviewStat').textContent=algorithms.reduce((n,x)=>n+(x.reviewCount||0),0);$('#practiceMastered').textContent=$('#masteredStat').textContent;$('#practiceReviews').textContent=$('#reviewStat').textContent }
  function categories(){const counts=Object.create(null);algorithms.forEach(x=>counts[x.category]=(counts[x.category]||0)+1);const colors=['#8b5cf6','#42b8e8','#37d67a','#f7c95e','#ef7d9b','#f39a5a'];$('#categories').innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,count],i)=>`<button class="category-btn" data-category="${esc(name)}"><i style="background:${colors[i%colors.length]}"></i><span data-i18n-live>${esc(name)}</span> <small>${count}</small></button>`).join('');const chosen=$('#practiceCategory').value;$('#practiceCategory').innerHTML='<option value="Any category" data-i18n="ui086">Any category</option>'+Object.keys(counts).sort().map(x=>`<option value="${esc(x)}" data-i18n-live>${esc(x)}</option>`).join('');if(Object.hasOwn(counts,chosen))$('#practiceCategory').value=chosen}
  function filteredAlgorithms(){const q=$('#searchInput').value.trim().toLowerCase(),diff=$('#difficultyFilter').value,sort=$('#sortFilter').value,rank={New:0,Learning:1,Confident:2,Mastered:3};let list=algorithms.filter(x=>(!$('#priorityFilter').value||x.priority===$('#priorityFilter').value)&&(!favoritesOnly||x.favorite)&&(!categoryFilter||x.category===categoryFilter)&&(diff==='Any difficulty'||x.difficulty===diff)&&(!q||[x.title,x.category,x.pattern,x.tags,x.summary,x.notes].some(v=>String(v||'').toLowerCase().includes(q))));list.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title):sort==='difficulty'?(a,b)=>['Easy','Medium','Hard'].indexOf(a.difficulty)-['Easy','Medium','Hard'].indexOf(b.difficulty):sort==='category'?(a,b)=>a.category.localeCompare(b.category):sort==='mastery'?(a,b)=>(rank[b.masteryLevel]||0)-(rank[a.masteryLevel]||0):(a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));return list}
  function renderAlgorithmList(){const list=filteredAlgorithms();$('#resultCount').textContent=`${list.length} ${list.length===1?'item':'items'}`;$('#algorithmList').innerHTML=list.map(x=>`<article class="algorithm-card ${x.id===selectedId?'selected':''}" data-id="${esc(x.id)}" role="button" tabindex="0" aria-label="${esc(x.title)}"><h3>${x.favorite?'★ ':''}${esc(x.title)}</h3><div class="badges"><span class="badge accent" data-i18n-live>${esc(x.priority||'Unranked')}</span><span class="badge" data-i18n-live>${esc(x.category)}</span><span class="badge ${x.difficulty.toLowerCase()}" data-i18n-live>${esc(x.difficulty)}</span><span class="badge">${esc(x.timeComplexity)}</span><span class="badge accent" data-i18n-live>${esc(x.masteryLevel||'New')}</span></div><div class="pattern">${esc(x.pattern)}</div><p>${esc(x.summary)}</p></article>`).join('')||'<div class="empty" data-i18n="ui179">No algorithms match these filters.</div>'}
  function detail(){const x=algorithms.find(a=>a.id===selectedId);if(!x){$('#detailPane').innerHTML='<div class="empty" data-i18n="ui135">Choose an algorithm to begin.</div>';return} const implementation=VaultLanguages.get(x,currentLanguage); $('#detailPane').innerHTML=`<div class="detail-head"><div><p class="eyebrow" style="margin:0" data-i18n="ui134">ALGORITHM DETAILS</p><h1 contenteditable="true" data-bind="title">${esc(x.title)}</h1><span class="subtle" data-i18n-live>${x.reviewCount?`Reviewed ${x.reviewCount}× · ${new Date(x.lastReviewedAt).toLocaleString()}`:'Not reviewed yet'}</span></div><div class="actions"><button class="ghost" id="favoriteBtn" aria-label="Toggle favorite" data-i18n-aria-label="ui138">${x.favorite?'★':'☆'}</button><button class="danger" id="deleteAlgorithm" data-i18n="ui136">Delete</button><button class="primary" id="saveAlgorithm" data-i18n="ui137">Save changes</button></div></div><div class="form-grid">${selectControl('CATEGORY','category',['Arrays','Searching','Sorting','Strings','Linked Lists','Stacks & Queues','Trees','Graphs','Dynamic Programming','Greedy','Backtracking','Math','Heaps','Bit Manipulation','Other'],x.category)}${selectControl('STUDY PRIORITY','priority',['Essential','Core','Advanced','Unranked'],x.priority||'Unranked')}${selectControl('DIFFICULTY','difficulty',['Easy','Medium','Hard'],x.difficulty)}${selectControl('MASTERY','masteryLevel',['New','Learning','Confident','Mastered'],x.masteryLevel||'New')}${inputControl('TIME','timeComplexity',x.timeComplexity)}${inputControl('SPACE','spaceComplexity',x.spaceComplexity)}</div><div class="summary-block"><label class="block-label" for="summaryInput" data-i18n="ui141">SUMMARY</label><textarea id="summaryInput" data-bind="summary">${esc(x.summary)}</textarea></div><div class="code-head"><label class="block-label" data-i18n-live>${VaultLanguages.label(currentLanguage)} IMPLEMENTATION</label><div class="code-actions"><button class="ghost" id="editCode">Edit ${VaultLanguages.label(currentLanguage)}</button><button class="ghost" id="copyCode" data-i18n="ui142">Copy code</button></div></div>${languageNotice(x)}<pre class="codebox" id="codePreview"><code>${highlight(implementation.code,currentLanguage)}</code></pre><textarea class="code-input hidden" id="codeInput" data-bind="code" aria-label="${VaultLanguages.label(currentLanguage)} implementation" spellcheck="false">${esc(implementation.code)}</textarea><div class="bottom-grid">${inputControl('PATTERN','pattern',x.pattern)}${inputControl('TAGS','tags',x.tags)}<div class="control"><label for="learningNotes" data-i18n="ui145">LEARNING NOTES & EDGE CASES</label><textarea id="learningNotes" data-bind="notes">${esc(x.notes)}</textarea></div></div><div class="savebar"><span data-i18n="ui146">Ctrl+S save · Ctrl+N new · Ctrl+F search</span><span data-i18n="ui147">100% local · Browser storage</span></div>`;bindDetail(x)}
  const inputControl=(label,key,value)=>`<div class="control"><label for="field-${key}" data-i18n-live>${label}</label><input id="field-${key}" class="field" ${key.endsWith("Complexity")?'list="complexityOptions"':""} data-bind="${key}" value="${esc(value)}"></div>`;
  const selectControl=(label,key,items,value)=>`<div class="control"><label for="field-${key}" data-i18n-live>${label}</label><select id="field-${key}" data-bind="${key}">${[...new Set([...items,value])].filter(v=>v!=null).map(v=>`<option value="${esc(v)}" data-i18n-live ${v===value?'selected':''}>${esc(v)}</option>`).join('')}</select></div>`;
  function languageNotice(x) {
    const sample = VaultLanguages.get(x,currentLanguage);
    const name = VaultLanguages.label(currentLanguage);
    const message = sample.source === 'missing' ? 'No built-in ' + name + ' version for this entry yet. Use Edit ' + name + ' to add your own. Your C# code is unchanged.' :
      sample.source === 'reference' ? 'Built-in ' + name + ' reference for the original algorithm. Personal C# edits are not automatically translated. Check this version’s signature and comments; C#-specific notes may differ.' :
      name + ' code is saved separately. Switching languages keeps your other implementations.';
    return '<p class="language-notice" data-i18n-live data-missing="' + (sample.source === 'missing') + '">' + esc(message) + '</p>';
  }
  function bindDetail(x){
    const editingLanguage = currentLanguage;
    $('#copyCode').disabled = !VaultLanguages.get(x, editingLanguage).code;
    const assignField = el => {
      const value = el.isContentEditable ? el.textContent : el.value;
      if (el.dataset.bind === 'code') VaultLanguages.set(x, editingLanguage, value);
      else x[el.dataset.bind] = value;
    };
    $('#editCode').onclick = () => {
      const editing = $('#codeInput').classList.contains('hidden');
      $('#codeInput').classList.toggle('hidden', !editing);
      $('#codePreview').classList.toggle('hidden', editing);
      $('#editCode').textContent = editing ? 'Preview' : 'Edit ' + VaultLanguages.label(editingLanguage);
      if (editing) $('#codeInput').focus();
      else $('#codePreview code').innerHTML = highlight(VaultLanguages.get(x,editingLanguage).code, editingLanguage);
    };
    $('#detailPane').oninput = event => {
      const el = event.target.closest('[data-bind]');
      if (!el) return;
      assignField(el);
      $('#copyCode').disabled = !VaultLanguages.get(x, editingLanguage).code;
      x.updatedAt = now();
      queueSave(KEY);
    };
    $('#codeInput').onkeydown = event => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      const editor = event.target;
      editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end');
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    };
$('#saveAlgorithm').onclick=()=>{ $$('[data-bind]').forEach(assignField);x.updatedAt=now();persistAndRender('Algorithm saved')};$('#favoriteBtn').onclick=()=>{x.favorite=!x.favorite;persistAndRender(x.favorite?'Added to favorites':'Removed from favorites')};$('#copyCode').onclick=()=>copyText(VaultLanguages.get(x,editingLanguage).code);$('#deleteAlgorithm').onclick=()=>{if(confirm(`Delete “${x.title}”?`)){algorithms=algorithms.filter(a=>a.id!==x.id);selectedId=algorithms[0]?.id;persistAndRender('Algorithm deleted')}}}
  function renderNotes(){
    let selectedSemester = $('#semesterFilter').value;
    const semesters = [...new Set(notes.map(x => x.semester).filter(Boolean))].sort();
    $('#semesterFilter').innerHTML = '<option value="" data-i18n="ui076">All semesters</option>' + semesters.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    if (semesters.includes(selectedSemester)) $('#semesterFilter').value = selectedSemester;
    else selectedSemester = '';
    const q=$('#noteSearch').value.trim().toLowerCase(),list=notes.filter(x=>(!selectedSemester||x.semester===selectedSemester)&&(!q||[x.title,x.course,x.semester,x.body].some(v=>String(v).toLowerCase().includes(q)))).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||String(b.updatedAt).localeCompare(String(a.updatedAt)));$('#threadCount').textContent=list.length;$('#threadList').innerHTML=list.map(x=>`<article class="thread-card ${x.id===selectedNoteId?'selected':''}" data-note="${esc(x.id)}" role="button" tabindex="0" aria-label="${esc(x.title)}"><h3>${x.pinned?'● ':''}${esc(x.title)}</h3><div class="badges"><span class="badge">${esc(x.course)}</span><span class="badge accent">${esc(x.semester)}</span></div><p>${esc(x.body)}</p><footer>💬 ${x.replies?.length||0}</footer></article>`).join('');renderThreadDetail()}
  function renderThreadDetail(){const n=notes.find(x=>x.id===selectedNoteId);if(!n){$('#threadDetail').innerHTML='<div class="empty" data-i18n="ui151">Create a note thread to begin.</div>';return}$('#threadDetail').innerHTML=`<div class="thread-form"><div class="detail-head"><div><p class="eyebrow" style="margin:0" data-i18n="ui150">THREAD DETAILS</p><h1 contenteditable="true" data-note-bind="title">${esc(n.title)}</h1><span class="subtle" data-i18n-live>Updated ${new Date(n.updatedAt).toLocaleString()} · ${n.replies?.length||0} replies</span></div><div class="actions"><button class="ghost" id="pinNote">${n.pinned?'Unpin':'Pin'}</button><button class="danger" id="deleteNote" data-i18n="ui136">Delete</button><button class="primary" id="saveNote" data-i18n="ui154">Save thread</button></div></div><div class="two-col" style="margin-top:26px">${noteInput('COURSE / SUBJECT','course',n.course)}${noteInput('SEMESTER','semester',n.semester)}</div><div class="control" style="margin-top:20px"><label data-i18n="ui157">MAIN NOTE</label><textarea data-note-bind="body" aria-label="Main note" data-i18n-aria-label="ui158">${esc(n.body)}</textarea></div><div class="attachment-card"><div class="section-row"><div><p class="eyebrow" style="margin:0" data-i18n="ui159">ATTACHMENTS</p><span class="subtle" data-i18n="ui160">The browser edition keeps notes private; use file paths or links in the main note.</span></div><button class="ghost" id="attachmentHelp" data-i18n="ui161">How it works</button></div></div><div class="discussion-card"><div class="section-row"><p class="eyebrow" style="margin:0" data-i18n="ui162">DISCUSSION</p><span class="subtle" data-i18n="ui163">Forum-style replies</span></div>${(n.replies||[]).map((r,index)=>`<div class="reply"><div class="reply-heading"><small>${esc(r.author)} · ${new Date(r.createdAt).toLocaleString()}</small><button class="danger delete-reply" data-delete-reply="${index}" aria-label="Delete comment ${index+1}" data-i18n="ui164">Delete comment</button></div><p>${esc(r.content)}</p></div>`).join('')}</div><div class="reply-box"><textarea id="replyText" aria-label="Reply draft" data-i18n-aria-label="ui165" placeholder="Add a question, clarification, correction, or summary" data-i18n-placeholder="ui166">${esc(replyDrafts.get(n.id)||'')}</textarea><button class="primary" id="postReply" data-i18n="ui167">Post reply</button></div></div>`;bindThread(n)}
  const noteInput=(label,key,value)=>`<div class="control"><label for="note-${key}" data-i18n-live>${label}</label><input id="note-${key}" class="field" style="width:100%" data-note-bind="${key}" value="${esc(value)}"></div>`;
  function bindThread(n){
    $('#threadDetail').onclick = event => {
      const button = event.target.closest('[data-delete-reply]');
      if (!button) return;
      const index = Number(button.dataset.deleteReply);
      if (!Number.isInteger(index) || index < 0 || index >= (n.replies?.length || 0)) return;
      if (!confirm('Delete this comment? This cannot be undone.')) return;
      const previousUpdatedAt = n.updatedAt;
      const [removed] = n.replies.splice(index, 1);
      n.updatedAt = now();
      if (!saveNotes()) {
        n.replies.splice(index, 0, removed);
        n.updatedAt = previousUpdatedAt;
        renderNotes();
        toast('Comment was not deleted because saving failed.');
        return;
      }
      renderNotes();
      toast('Comment deleted');
    };
    $('#threadDetail').oninput = event => {
      if(event.target.id === 'replyText') { replyDrafts.set(n.id,event.target.value); return; }
      const el = event.target.closest('[data-note-bind]');
      if(!el) return;
      n[el.dataset.noteBind] = el.isContentEditable ? el.textContent : el.value;
      n.updatedAt=now();
      queueSave(NOTES_KEY);
    };
$('#saveNote').onclick=()=>{$$('[data-note-bind]').forEach(el=>n[el.dataset.noteBind]=el.isContentEditable?el.textContent:el.value);n.updatedAt=now();if(saveNotes()){renderNotes();toast('Thread saved')}};$('#pinNote').onclick=()=>{n.pinned=!n.pinned;n.updatedAt=now();saveNotes();renderNotes()};$('#deleteNote').onclick=()=>{if(confirm(`Delete “${n.title}”?`)){notes=notes.filter(x=>x.id!==n.id);selectedNoteId=notes[0]?.id;saveNotes();renderNotes()}};$('#postReply').onclick=()=>{const text=$('#replyText').value.trim();if(!text)return;(n.replies??=[]).push({author:'You',content:text,createdAt:now()});n.updatedAt=now();replyDrafts.delete(n.id);const saved=saveNotes();renderNotes();if(saved)toast('Reply added')};$('#attachmentHelp').onclick=()=>alert('For security, browsers cannot silently copy local files. Add a file path, cloud link, or description in the main note. The native C# edition supports managed local attachments, but may be blocked by Windows on unsigned builds.')}
  function renderPractice(){stats();if(!practiceCurrent)generateChallenge();else challenge()}
  function practicePool(){const d=$('#practiceDifficulty').value,c=$('#practiceCategory').value,m=$('#practiceMastery').value;return algorithms.filter(x=>(!$('#practicePriority').value||x.priority===$('#practicePriority').value)&&(d==='Any difficulty'||x.difficulty===d)&&(c==='Any category'||x.category===c)&&(m==='Any mastery'||(x.masteryLevel||'New')===m))}
  function generateChallenge(){const pool=practicePool();if(!pool.length){practiceCurrent=null;$('#challengeCard').innerHTML='<section class="challenge-main empty"><div><h2 data-i18n="ui168">No matching challenges</h2><p class="muted" data-i18n="ui169">Broaden the difficulty, category, or mastery filter to continue.</p></div></section>';return}const choices=pool.length>1?pool.filter(x=>x.id!==practiceCurrent?.id):pool;practiceCurrent=choices[Math.floor(Math.random()*choices.length)];challenge()}
  function challenge(revealed=false){practiceRevealed=revealed;const x=practiceCurrent;if(!x)return;$('#challengeCard').innerHTML=`<section class="challenge-main"><div class="section-row"><p class="eyebrow mint" style="margin:0" data-i18n="ui170">TODAY'S CHALLENGE</p><span class="badge accent">${esc(x.masteryLevel||'New').toUpperCase()}</span></div><h1>${esc(x.title)}</h1><div class="badges"><span class="badge" data-i18n-live>${esc(x.category)}</span><span class="badge ${x.difficulty.toLowerCase()}" data-i18n-live>${esc(x.difficulty)}</span></div><p class="eyebrow" style="margin-left:0" data-i18n="ui171">PROBLEM BRIEF</p><p style="font-size:15px;line-height:1.6">${esc(x.summary)}</p><div class="checklist"><p class="eyebrow" style="margin:0 0 8px" data-i18n="ui172">INTERVIEW CHECKLIST</p><span class="muted" data-i18n="ui173">1. Clarify constraints · 2. State brute force · 3. Derive the optimal pattern · 4. Analyze complexity · 5. Test edge cases</span></div><button class="primary" id="revealSolution" ${revealed?'disabled':''}>${revealed?'Solution revealed':'Reveal solution (Space)'}</button></section>${revealed?`<section class="solution"><div class="complexities"><div><span class="eyebrow" data-i18n="ui143">PATTERN</span><b>${esc(x.pattern)}</b></div><div><span class="eyebrow" data-i18n="ui139">TIME</span><b>${esc(x.timeComplexity)}</b></div><div><span class="eyebrow" data-i18n="ui140">SPACE</span><b>${esc(x.spaceComplexity)}</b></div></div><p class="eyebrow" data-i18n-live>${VaultLanguages.label(currentLanguage)} REFERENCE SOLUTION</p>${languageNotice(x)}<pre class="codebox"><code>${highlight(VaultLanguages.get(x,currentLanguage).code,currentLanguage)}</code></pre><p class="eyebrow" data-i18n="ui176">NOTES & EDGE CASES</p><p class="muted">${esc(x.notes)}</p><div class="grade-row"><button class="ghost grade" data-grade="Learning" data-i18n="ui177">Need review</button><button class="ghost grade" data-grade="Confident" data-i18n="ui178">Got it</button><button class="primary grade" data-grade="Mastered" data-i18n="ui091">Mastered</button></div></section>`:''}`;const reveal=$('#revealSolution');if(reveal&&!revealed)reveal.onclick=()=>challenge(true);$$('.grade').forEach(b=>b.onclick=()=>{x.masteryLevel=b.dataset.grade;x.reviewCount=(x.reviewCount||0)+1;x.lastReviewedAt=now();x.updatedAt=now();const saved=saveAlgorithms();stats();if(saved)toast(`Marked ${x.masteryLevel}`);generateChallenge()})}
  function newAlgorithm(){const x={id:uid(),title:'New Algorithm',priority:'Unranked',category:'Other',difficulty:'Medium',timeComplexity:'O(n)',spaceComplexity:'O(1)',tags:'',pattern:'General',summary:'Describe what the algorithm solves and when to use it.',notes:'Add edge cases, constraints, and learning notes here.',code:'public static void Solve()\n{\n    // Add your C# implementation\n}',favorite:false,masteryLevel:'New',reviewCount:0,updatedAt:now()};algorithms.unshift(x);selectedId=x.id;categoryFilter='';$('#priorityFilter').value='';$('#searchInput').value='';$('#difficultyFilter').value='Any difficulty';showView('algorithms');persistAndRender('New algorithm created')}
  function newThread(){const n={id:uid(),title:'New semester thread',course:'Course name',semester:'Semester 1',body:'Write lecture notes, study guides, questions, or summaries here.',pinned:false,updatedAt:now(),replies:[]};notes.unshift(n);selectedNoteId=n.id;$('#noteSearch').value='';$('#semesterFilter').value='';saveNotes();showView('notes');renderNotes()}
  function showView(view){flushSaves();currentView=view;favoritesOnly=view==='favorites';if(view!=='algorithms'&&view!=='favorites')categoryFilter='';$$('.view').forEach(x=>x.classList.add('hidden'));const targetId=view==='algorithms'||view==='favorites'?'algorithmView':`${view}View`;$(`#${targetId}`).classList.remove('hidden');$$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.view===view));if(view==='home')studyDesk.render();else if(view==='notes')renderNotes();else if(view==='practice')renderPractice();else if(view==='patterns')patternPage.render();else if(view==='learning')learningPage.render();else{$('#libraryTitle').textContent=favoritesOnly?'Favorites':categoryFilter||'All algorithms';renderAlgorithmList();detail()}}
  function renderAll(){updatePackButton();stats();categories();renderAlgorithmList();detail();if(currentView==='notes')renderNotes();if(currentView==='practice')renderPractice();if(currentView==='home')studyDesk.render()}
  $$('.nav').forEach(b=>b.onclick=()=>{categoryFilter='';showView(b.dataset.view)});$('#categories').onclick=e=>{const b=e.target.closest('[data-category]');if(!b)return;categoryFilter=b.dataset.category;favoritesOnly=false;showView('algorithms');$('#libraryTitle').textContent=categoryFilter;renderAlgorithmList()};$('#algorithmList').onclick=e=>{const card=e.target.closest('[data-id]');if(card){selectedId=card.dataset.id;renderAlgorithmList();detail()}};$('#threadList').onclick=e=>{const card=e.target.closest('[data-note]');if(card){selectedNoteId=card.dataset.note;renderNotes()}};
  $('#searchInput').oninput=renderAlgorithmList;$('#difficultyFilter').onchange=renderAlgorithmList;$('#sortFilter').onchange=renderAlgorithmList;$('#noteSearch').oninput=renderNotes;$('#newAlgorithm').onclick=newAlgorithm;$('#newNote').onclick=newThread;$('#createThread').onclick=newThread;$('#generateChallenge').onclick=generateChallenge;['practiceDifficulty','practiceCategory','practiceMastery','practicePriority'].forEach(id=>$(`#${id}`).onchange=generateChallenge);
  const themes=['Current','Dark','Purple','White','Ocean','Emerald','Rose','Amber','Crimson','Slate','Sky','Paper'];
  let savedTheme='Current';try{savedTheme=localStorage.getItem(THEME_KEY)||'Current'}catch{}
  function applyTheme(name, persist) {
    const chosen=themes.includes(name)?name:'Current';
    $('#themeSelect').value=chosen;document.body.dataset.theme=chosen.toLowerCase();
    fileTools?.refresh();
    if(persist)try{localStorage.setItem(THEME_KEY,chosen)}catch{toast('Theme applied for this session; browser storage is unavailable.')}
  }
  applyTheme(savedTheme,false);$('#themeSelect').onchange=e=>applyTheme(e.target.value,true);
  document.addEventListener('keydown',e=>{if(currentView==='home'&&e.ctrlKey&&e.key.toLowerCase()==='s'){e.preventDefault();flushSaves();return}if(currentView==='learning'){if(e.ctrlKey&&e.key.toLowerCase()==='f'){e.preventDefault();$('#learningSearch').focus()}if(e.ctrlKey&&e.key.toLowerCase()==='s'){e.preventDefault();flushSaves()}return;}if(currentView==='patterns'){if(e.ctrlKey&&e.key.toLowerCase()==='f'){e.preventDefault();$('#patternSearch').focus()}return;}if(e.ctrlKey&&e.key.toLowerCase()==='n'){e.preventDefault();currentView==='practice'?generateChallenge():currentView==='notes'?newThread():newAlgorithm()}if(e.ctrlKey&&e.key.toLowerCase()==='f'&&currentView!=='practice'){e.preventDefault();(currentView==='notes'?$('#noteSearch'):$('#searchInput')).focus()}if(e.ctrlKey&&e.key.toLowerCase()==='s'&&currentView!=='practice'){e.preventDefault();(currentView==='notes'?$('#saveNote'):$('#saveAlgorithm'))?.click()}if(e.code==='Space'&&currentView==='practice'&&!e.target.closest('input,textarea,select,button,[contenteditable]')){e.preventDefault();$('#revealSolution')?.click()}});

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast('Copied to clipboard'); }
    catch { toast('Clipboard is unavailable here. Select the text and press Ctrl+C.'); }
  }
  function downloadText(name, contents) {
    const url=URL.createObjectURL(new Blob([contents],{type:'application/json'}));
    const anchor=document.createElement('a');
    anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('#exportBackup').onclick = () => {
    flushSaves();
    downloadText('alg0Vault-backup-'+new Date().toISOString().slice(0,10)+'.json',VaultData.backup(algorithms,notes,learningProgress));
    toast('Backup exported. Keep it somewhere safe.');
  };
  $('#importBackup').onclick = () => $('#backupFile').click();
  $('#backupFile').onchange = async event => {
    const file=event.target.files[0];
    if(!file)return;
    try {
      if(blockedStores.size)throw new Error('Existing browser storage could not be read. Export the session first and keep the original storage for recovery.');
      if(file.size>20*1024*1024)throw new Error('Choose a backup smaller than 20 MB.');
      const incoming=VaultData.parseBackup(await file.text());
      const nextAlgorithms=VaultData.merge(algorithms,incoming.algorithms);
      const nextNotes=VaultData.merge(notes,incoming.notes);
      const nextLearning=VaultData.merge(learningProgress,incoming.learning || []);
      const added=nextAlgorithms.length-algorithms.length+nextNotes.length-notes.length+nextLearning.length-learningProgress.length;
      if(!added){toast('These records are already in your workspace.');return;}
      if(!confirm('Import '+added+' new records? Existing records with the same ID will be kept.'))return;
      // Back up every previous value before the multi-key write; roll back on quota failure.
      const oldAlgorithms=localStorage.getItem(KEY),oldNotes=localStorage.getItem(NOTES_KEY),oldLearning=localStorage.getItem(LEARNING_KEY);
      try {
        localStorage.setItem(KEY,JSON.stringify(nextAlgorithms));
        localStorage.setItem(NOTES_KEY,JSON.stringify(nextNotes));
        localStorage.setItem(LEARNING_KEY,JSON.stringify(nextLearning));
      } catch(error) {
        try {
          oldAlgorithms===null?localStorage.removeItem(KEY):localStorage.setItem(KEY,oldAlgorithms);
          oldNotes===null?localStorage.removeItem(NOTES_KEY):localStorage.setItem(NOTES_KEY,oldNotes);
          oldLearning===null?localStorage.removeItem(LEARNING_KEY):localStorage.setItem(LEARNING_KEY,oldLearning);
        } catch { throw new Error('Import failed and storage recovery could not complete. Export your current session before closing.'); }
        throw error;
      }
      algorithms=nextAlgorithms;notes=nextNotes;learningProgress=nextLearning;
      fileTools?.refresh();
      dirtyStores.delete(KEY);dirtyStores.delete(NOTES_KEY);dirtyStores.delete(LEARNING_KEY);
      selectedId ||= algorithms[0]?.id; selectedNoteId ||= notes[0]?.id;
      renderAll();if(currentView==='learning')learningPage.render();setSaveStatus('Backup imported','saved');toast('Imported '+added+' records.');
    } catch(error) { toast('Import failed: '+error.message); }
    finally { event.target.value=''; }
  };
  $('#clearFilters').onclick=()=>{
    categoryFilter='';$('#priorityFilter').value='';$('#searchInput').value='';$('#difficultyFilter').value='Any difficulty';
    $('#sortFilter').value='recent';showView('algorithms');
  };
  $('#semesterFilter').onchange=renderNotes;
  $('#difficultyFilter').setAttribute('aria-label','Filter algorithm difficulty');
  $('#sortFilter').setAttribute('aria-label','Sort algorithms');
  document.addEventListener('keydown',event=>{
    const card=event.target.closest('[data-id],[data-note]');
    if(card && (event.key==='Enter'||event.key===' ')){event.preventDefault();card.click();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)flushSaves();});
  window.addEventListener('beforeunload',event=>{
    flushSaves();
    if(dirtyStores.size || fileTools?.hasUnsavedFile()){event.preventDefault();event.returnValue='';}
  });

  const patternPage = VaultPatterns.create({
    escape: esc, highlight, copyText, getLanguage: () => currentLanguage,
    createStudyNote(pattern) {
      flushSaves();
      const note = {
        id: uid(), title: pattern.title + ' — study thread',
        course: 'LeetCode Patterns', semester: 'Interview preparation',
        body: [
          'PATTERN: ' + pattern.title,
          'Recognition clue: ' + pattern.cue,
          'Correctness invariant: ' + pattern.invariant,
          'MY EXPLANATION\nExplain why the invariant holds and when this pattern fails.',
          'SOLVING RECIPE\n' + pattern.steps.map((step, i) => (i + 1) + '. ' + step).join('\n'),
          'PRACTICE LOG\n' + pattern.practice.map(q => '[ ] ' + q.title + '\nApproach: ' + q.approach + '\nMy complexity / edge cases / mistakes:').join('\n\n'),
          'RECALL CHECK\nRe-solve without the template. Compare brute force with the optimized approach.'
        ].join('\n\n'),
        pinned: false, updatedAt: now(), replies: []
      };
      notes.unshift(note); selectedNoteId = note.id;
      $('#noteSearch').value = ''; $('#semesterFilter').value = '';
      const saved = saveNotes(); showView('notes');
      if (saved) toast('Pattern study thread created');
    }
  });
  $('#languageSelect').value = currentLanguage;
  $('#languageSelect').onchange = event => {
    flushSaves();
    currentLanguage = VaultLanguages.valid(event.target.value) ? event.target.value : 'csharp';
    $('#languageSelect').value = currentLanguage;
    try { localStorage.setItem(LANGUAGE_KEY, currentLanguage); }
    catch { toast('Language changed for this session; the preference could not be saved.'); }
    detail();
    if (currentView === 'patterns') patternPage.render();
    if (currentView === 'practice') challenge(practiceRevealed);
    fileTools?.refresh();
  };
  const learningPage = VaultLearning.create({
    highlight, copyText, flushSaves,
    getProgress: () => learningProgress,
    updateProgress(id, patch, immediate) {
      let record = learningProgress.find(x => x.id === id);
      if (!record) { record = { id, completed: false, notes: '', updatedAt: now() }; learningProgress.push(record); }
      Object.assign(record, patch, { updatedAt: now() });
      if (immediate) saveLearning(); else queueSave(LEARNING_KEY);
    },
    createStudyNote(item, journal) {
      flushSaves();
      const id = 'learning-note-' + item.id;
      let note = notes.find(x => x.id === id);
      if (!note) {
        note = { id, title: item.title + ' — study thread', course: item.kind === 'course' ? 'University courses' : 'C# Learning Hub', semester: item.group,
          body: ['LESSON: ' + item.title, 'Open Study Hub and search this title to revisit the lesson.',
            'MY EXPLANATION & EVIDENCE\n' + (journal || 'Explain the idea, record your tests and link a commit.'),
            'QUESTIONS\nWhat is still unclear?', 'NEXT PRACTICE\nRebuild a small example without copying.'].join('\n\n'),
          pinned: false, updatedAt: now(), replies: [] };
        notes.unshift(note); saveNotes();
      }
      selectedNoteId = id; $('#noteSearch').value = ''; $('#semesterFilter').value = ''; showView('notes');
    }
  });
  function updatePackButton() {
    const missing = VaultCatalog.extra.filter(x => !algorithms.some(a => a.id === x.id)).length;
    $('#addAlgorithmPack').textContent = missing ? 'Add ' + missing + ' new algorithms' : 'Algorithm pack added';
    $('#addAlgorithmPack').disabled = missing === 0;
  }
  $('#priorityFilter').onchange = renderAlgorithmList;
  $('#essentialAlgorithms').onclick = () => {
    categoryFilter=''; $('#searchInput').value=''; $('#difficultyFilter').value='Any difficulty';
    $('#priorityFilter').value='Essential'; showView('algorithms');
  };
  $('#addAlgorithmPack').onclick = () => {
    algorithms = VaultData.merge(algorithms,VaultData.algorithms(VaultCatalog.extra));
    selectedId ||= algorithms[0]?.id;
    persistAndRender('New algorithms added; your existing work was kept');
  };
  fileTools = VaultFiles.create({
    snapshot: () => ({ algorithms, notes, learning: learningProgress, settings: { theme: $('#themeSelect').value, language: currentLanguage } }),
    parse(text) {
      const parsed=VaultData.parseBackup(text), raw=JSON.parse(text);
      if(raw.settings !== undefined && (!raw.settings || typeof raw.settings !== 'object' || !themes.includes(raw.settings.theme) || (raw.settings.language !== undefined && !VaultLanguages.valid(raw.settings.language))))
        throw Error('Save file has unsupported appearance or language settings.');
      return { ...parsed, learning: parsed.learning || [], settings: raw.settings };
    },
    replace(incoming) {
      if(blockedStores.size)throw Error('Existing browser storage could not be read. Export your session before resolving storage access.');
      const writes=[[KEY,JSON.stringify(incoming.algorithms)],[NOTES_KEY,JSON.stringify(incoming.notes)],[LEARNING_KEY,JSON.stringify(incoming.learning)]];
      if(incoming.settings)writes.push([THEME_KEY,incoming.settings.theme]);
      writes.push([LANGUAGE_KEY,incoming.settings?.language || 'csharp']);
      const old=writes.map(([key])=>[key,localStorage.getItem(key)]);
      try { for(const [key,value] of writes)localStorage.setItem(key,value); }
      catch(error) {
        let recoveryFailed=false;
        for(const [key,value] of old)try{value===null?localStorage.removeItem(key):localStorage.setItem(key,value)}catch{recoveryFailed=true}
        if(recoveryFailed){[KEY,NOTES_KEY,LEARNING_KEY].forEach(key=>dirtyStores.add(key));setSaveStatus('Storage recovery failed — export your session','error');}
        throw Error(recoveryFailed?'Load failed and browser storage recovery was incomplete. Export your current session before closing.':'Load failed; current workspace preserved. '+error.message);
      }
      clearTimeout(saveTimer); dirtyStores.clear(); replyDrafts.clear();
      algorithms=incoming.algorithms;notes=incoming.notes;learningProgress=incoming.learning;
      selectedId=algorithms[0]?.id;selectedNoteId=notes[0]?.id;practiceCurrent=null;
      if(incoming.settings)applyTheme(incoming.settings.theme,false);
      currentLanguage=incoming.settings?.language || 'csharp';$('#languageSelect').value=currentLanguage;
      categoryFilter='';$('#priorityFilter').value='';$('#searchInput').value='';$('#difficultyFilter').value='Any difficulty';
      $('#noteSearch').value='';$('#semesterFilter').value='';
      showView('algorithms');renderAll();setSaveStatus('Save file loaded · saved in browser','saved');
    },
    download: downloadText, parseBackup: VaultData.parseBackup, confirm,
    status(message,error=false){$('#fileStatus').textContent=message;$('#fileStatus').dataset.state=error?'error':''},
    buttons: [$('#openSaveFile'),$('#saveWorkspaceFile'),$('#saveWorkspaceAs')], input: $('#saveFileInput')
  });
  $('#openSaveFile').onclick = () => fileTools.open();
  $('#saveWorkspaceFile').onclick = () => fileTools.save();
  $('#saveWorkspaceAs').onclick = () => fileTools.save(true);
  const studyDesk=VaultDesk.create({
    getAlgorithms:()=>algorithms,getNotes:()=>notes,getProgress:()=>learningProgress,items:VAULT_LEARNING.items,
    open(kind,id){
      flushSaves();
      if(kind==='lesson'){showView('learning');learningPage.open(id);return}
      if(kind==='note'){selectedNoteId=id;$('#noteSearch').value='';$('#semesterFilter').value='';showView('notes');return}
      if(!algorithms.some(x=>x.id===id))return;
      if(kind==='practice'){practiceCurrent=algorithms.find(x=>x.id===id);['practiceDifficulty','practiceCategory','practiceMastery'].forEach((key,i)=>$('#'+key).value=['Any difficulty','Any category','Any mastery'][i]);$('#practicePriority').value='';showView('practice');return}
      selectedId=id;categoryFilter='';$('#searchInput').value='';$('#priorityFilter').value='';$('#difficultyFilter').value='Any difficulty';showView('algorithms');
    }
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();showView('home');$('#deskSearch').focus()}
  });
  renderAll();showView('home');VaultLocale.render();
})();
