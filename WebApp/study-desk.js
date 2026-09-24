(function(root){
  'use strict';
  const clean=s=>String(s??'').toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/ł/g,'l');
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function plan(algorithms,items,progress,now=Date.now()){
    const records=new Map(progress.map(x=>[x.id,x]));
    const due=items.filter(x=>{const r=records.get(x.id);return r?.reviewEnabled&&(!r.reviewDue||Date.parse(r.reviewDue)<=now)}).sort((a,b)=>(Date.parse(records.get(a.id).reviewDue)||0)-(Date.parse(records.get(b.id).reviewDue)||0));
    const week=items.find(x=>x.kind==='week'&&!records.get(x.id)?.completed);
    const rank={Essential:0,Core:1,Advanced:2,Unranked:3};
    const next=algorithms.filter(x=>x.masteryLevel!=='Mastered').sort((a,b)=>(rank[a.priority]??3)-(rank[b.priority]??3)||(a.reviewCount||0)-(b.reviewCount||0)||a.title.localeCompare(b.title))[0];
    return {due,week,next,completed:items.filter(x=>x.kind==='week'&&records.get(x.id)?.completed).length};
  }
  function search(query,algorithms,items,notes){
    const terms=clean(query).trim().split(/\s+/).filter(Boolean);
    if(!terms.length)return [];
    const entries=[...algorithms.map(x=>({kind:'algorithm',id:x.id,title:x.title,meta:x.category+' · '+x.priority,text:[x.title,x.category,x.summary,x.tags,x.notes].join(' ')})),...items.map(x=>({kind:'lesson',id:x.id,title:x.title,meta:x.kind+' · '+x.group,text:[x.title,x.english,x.group,x.markdown,...Object.values(x.translations||{})].join(' ')})),...notes.map(x=>({kind:'note',id:x.id,title:x.title,meta:x.course,text:[x.title,x.body,x.course,x.semester,...(x.replies||[]).map(r=>r.content)].join(' ')}))];
    return entries.filter(x=>terms.every(t=>clean(x.text).includes(t))).sort((a,b)=>Number(clean(b.title).includes(clean(query)))-Number(clean(a.title).includes(clean(query)))||a.title.localeCompare(b.title));
  }
  function create({getAlgorithms,getProgress,getNotes,items,open}){
    const $=s=>document.querySelector(s);
    const link=(kind,id,title,meta)=>`<button class="desk-link" data-desk-kind="${escape(kind)}" data-desk-id="${escape(id)}"><span>${escape(title)}</span><small>${escape(meta)}</small><b aria-hidden="true">↗</b></button>`;
    function results(){
      const q=$('#deskSearch').value;
      const rows=search(q,getAlgorithms(),items,getNotes());
      $('#deskSearchCount').textContent=q.trim()?`${rows.length} matches${rows.length>40?' · showing first 40':''}`:'Search algorithms, lessons, definitions and your notes.';
      $('#deskResults').innerHTML=rows.slice(0,40).map(x=>link(x.kind,x.id,x.title,x.meta)).join('')||(q.trim()?'<p data-i18n="ui260">No matches. Try a shorter term or a course name.</p>':'');
    }
    function render(){
      const algorithms=getAlgorithms(),p=plan(algorithms,items,getProgress());
      $('#deskProgress').textContent=`${p.completed} / ${items.filter(x=>x.kind==='week').length} roadmap weeks complete`;
      $('#deskMeter').value=p.completed;$('#deskMeter').max=items.filter(x=>x.kind==='week').length||1;
      $('#deskDue').textContent=p.due.length;$('#deskMastered').textContent=algorithms.filter(x=>x.masteryLevel==='Mastered').length+' / '+algorithms.length;
      $('#deskPlan').innerHTML=`<article><span class="desk-step" data-i18n="ui252">01 · RECALL</span><h2 data-i18n="ui255">Retrieve before rereading</h2>${p.due.length?link('lesson',p.due[0].id,p.due[0].title,'Due for review'):'<p data-i18n="ui262">No scheduled reviews due. Add a lesson to the review queue in Study Hub.</p>'}</article><article><span class="desk-step" data-i18n="ui253">02 · LEARN</span><h2 data-i18n="ui256">Move your roadmap forward</h2>${p.week?link('lesson',p.week.id,p.week.title,'Next unfinished week'):'<p data-i18n="ui263">All roadmap weeks are complete. Revisit your weakest topics or improve a portfolio project.</p>'}</article><article><span class="desk-step" data-i18n="ui254">03 · BUILD</span><h2 data-i18n="ui257">Solve one problem</h2>${p.next?link('practice',p.next.id,p.next.title,p.next.priority+' · '+p.next.category):'<p data-i18n="ui264">No unfinished algorithms. Add an algorithm or revisit a mastered one.</p>'}</article>`;
      const groups=[...new Set(algorithms.map(x=>x.category))].sort();
      $('#deskSkills').innerHTML=groups.map(group=>{const rows=algorithms.filter(x=>x.category===group),done=rows.filter(x=>x.masteryLevel==='Mastered').length;return `<div class="desk-skill"><span>${escape(group)}</span><b>${done}/${rows.length}</b><progress max="${rows.length}" value="${done}" aria-label="${escape(group)} self-rated mastery"></progress></div>`}).join('')||'<p data-i18n="ui265">Your algorithm library is empty. Add the algorithm pack from All algorithms.</p>';
      results();
    }
    $('#deskSearch').oninput=results;
    $('#deskClear').onclick=()=>{$('#deskSearch').value='';results();$('#deskSearch').focus()};
    $('#homeView').onclick=event=>{const b=event.target.closest('[data-desk-kind]');if(b)open(b.dataset.deskKind,b.dataset.deskId)};
    $('#focusLength').value='25';
    let remaining=25*60,deadline=null,timer=null;
    function tick(){
      if(deadline!==null)remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
      $('#focusClock').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
      if(deadline!==null&&remaining===0){deadline=null;$('#focusStatus').textContent='Session complete. Take a break; progress is not graded automatically.'}
      $('#focusToggle').textContent=deadline===null?'Start':'Pause';
      clearTimeout(timer);if(deadline!==null)timer=setTimeout(tick,500);
    }
    $('#focusToggle').onclick=()=>{if(deadline!==null){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));deadline=null}else{if(!remaining)remaining=Number($('#focusLength').value)*60;deadline=Date.now()+remaining*1000}$('#focusStatus').textContent=deadline===null?'Paused.':'Focus on one task. The timer continues when you switch sections.';tick()};
    const reset=()=>{deadline=null;remaining=Number($('#focusLength').value)*60;$('#focusStatus').textContent='Session-only timer. Reloading resets it.';tick()};
    $('#focusReset').onclick=reset;$('#focusLength').onchange=reset;reset();
    return {render};
  }
  root.VaultDesk={plan,search,create};if(typeof module!=='undefined')module.exports=root.VaultDesk;
})(typeof window!=='undefined'?window:globalThis);
