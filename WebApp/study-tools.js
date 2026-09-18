/* Device-local recall scheduling; no background jobs or notifications. */
(function(root) {
  'use strict';
  const intervals = [1,3,7,14,30];
  const day = 86400000;
  const due = (record, now = Date.now()) => record.reviewEnabled === true && (!record.reviewDue || Date.parse(record.reviewDue) <= now);
  function grade(record, rating, now = Date.now()) {
    if (!['again','hard','good'].includes(rating)) throw Error('Unknown review rating');
    const step = Number.isInteger(record.reviewStep) ? Math.max(0,Math.min(4,record.reviewStep)) : 0;
    const delay = rating === 'again' ? 600000 : rating === 'hard' ? day : intervals[step] * day;
    return { reviewEnabled:true, reviewDue:new Date(now + delay).toISOString(), lastReviewed:new Date(now).toISOString(),
      reviewStep:rating === 'again' ? 0 : rating === 'good' ? Math.min(4,step+1) : step,
      recallCount:Math.min(1000000, (record.recallCount || 0) + 1) };
  }
  function section(markdown, title) {
    const marker = '## ' + title + '\n';
    const start = markdown.indexOf(marker);
    return start < 0 ? '' : markdown.slice(start + marker.length).split('\n## ')[0].trim();
  }
  function recall(item, count = 0) {
    if (item.kind === 'course') {
      const questions = section(item.markdown,'Recall questions').split('\n').filter(x=>/^\d+\. /.test(x));
      const answers = section(item.markdown,'Answer guidance').split('\n').filter(x=>/^\d+\. /.test(x));
      const index = questions.length ? count % questions.length : 0;
      if (questions[index]) return { question:questions[index].replace(/^\d+\. /,''), answer:answers[index]?.replace(/^\d+\. /,'') || 'Compare with the main points in this guide.' };
    }
    if (item.kind === 'glossary') return { question:section(item.markdown,'Check your understanding') || 'Explain ' + item.title + ' in your own words.', answer:section(item.markdown,'In plain English') + '\n\n' + section(item.markdown,'Small example') };
    return { question:'Without looking below, explain the main idea of “' + item.title + '”. Give an example and one failure case.', answer:item.kind === 'week' ? section(item.markdown,'Learn in order') + '\n\nBuild this: ' + section(item.markdown,'Build this') : item.markdown };
  }
  function create(options) {
    const $ = selector => document.querySelector(selector), esc = options.escape;
    const items = root.VAULT_LEARNING.items;
    const state = id => options.getProgress().find(x=>x.id===id) || {id};
    const trackable = item => item.kind !== 'reference';
    const dateLabel = value => value ? new Date(value).toLocaleString() : 'Now';
    function queue() { return items.filter(x=>trackable(x) && due(state(x.id))).sort((a,b)=>(Date.parse(state(a.id).reviewDue)||0)-(Date.parse(state(b.id).reviewDue)||0)); }
    function mount(item) {
      const record = state(item.id), canReview = trackable(item);
      const patch = values => { options.updateProgress(item.id,values,true); options.render(); };
      $('#studyTools').innerHTML = `<section class="study-toolbox" aria-label="Study tools" data-i18n-aria-label="ui241"><div class="learning-actions"><button id="studyBookmark" class="ghost" aria-pressed="${record.bookmarked===true}">${record.bookmarked ? '★ Bookmarked · remove' : '☆ Bookmark lesson'}</button>${canReview ? `<button id="studyReviewToggle" class="ghost" aria-pressed="${record.reviewEnabled===true}">${record.reviewEnabled ? 'Pause scheduled reviews' : 'Add to review queue'}</button>` : ''}<button id="studyDashboardLink" class="ghost" data-i18n="ui246">Today dashboard</button></div>${canReview ? `<p class="muted">${record.reviewEnabled ? `Next review: ${esc(dateLabel(record.reviewDue))}.` : 'Reviews are optional and separate from completion.'} ${record.recallCount || 0} recall attempts.</p><button id="studyRecall" class="secondary" data-i18n="ui247">Test my recall</button><div id="studyRecallCard" aria-live="polite"></div>` : ''}</section>`;
      $('#studyBookmark').onclick = () => patch({bookmarked:!state(item.id).bookmarked});
      $('#studyDashboardLink').onclick = () => options.open('today');
      if (!canReview) return;
      $('#studyReviewToggle').onclick = () => patch(state(item.id).reviewEnabled ? {reviewEnabled:false} : {reviewEnabled:true,reviewDue:new Date().toISOString()});
      $('#studyRecall').onclick = () => {
        const card = recall(item,state(item.id).recallCount || 0);
        $('#studyRecallCard').innerHTML = `<div class="study-recall"><p class="eyebrow" data-i18n="ui248">ANSWER FROM MEMORY FIRST</p><h2>${esc(card.question)}</h2><p data-i18n="ui324">Explain aloud before checking the reference. This is self-assessment, not automatic grading.</p><button id="studyReveal" class="primary" data-i18n="ui249">Reveal reference</button><div id="studyAnswer" class="learning-markdown"></div><div id="studyRatings" class="learning-actions"></div></div>`;
        $('#studyReveal').onclick = () => {
          $('#studyAnswer').innerHTML = options.markdown(card.answer);
          $('#studyReveal').disabled = true;
          const step = Math.max(0,Math.min(4,state(item.id).reviewStep || 0));
          $('#studyRatings').innerHTML = `<button id="studyAgain" class="ghost" data-i18n="ui250">Again · 10 minutes</button><button id="studyHard" class="ghost" data-i18n="ui251">With hints · 1 day</button><button id="studyGood" class="primary">Got it · ${intervals[step]} ${intervals[step]===1?'day':'days'}</button>`;
          let graded = false;
          for (const [id,rating] of [['studyAgain','again'],['studyHard','hard'],['studyGood','good']]) $('#'+id).onclick = () => {
            if (graded) return; graded = true;
            patch(grade(state(item.id),rating));
          };
        };
      };
    }
    function dashboard() {
      const reviews = queue(), bookmarks = items.filter(x=>state(x.id).bookmarked);
      const next = items.find(x=>x.kind==='week' && !state(x.id).completed);
      const upcoming = items.filter(x=>trackable(x) && state(x.id).reviewEnabled && !due(state(x.id))).sort((a,b)=>Date.parse(state(a.id).reviewDue)-Date.parse(state(b.id).reviewDue));
      const cards = list => list.map(x=>`<button class="study-jump" data-learning-id="${esc(x.id)}"><strong>${esc(x.title)}</strong><span>${esc(x.group)}${state(x.id).reviewEnabled ? ' · Review: ' + esc(dateLabel(state(x.id).reviewDue)) : ''}</span></button>`).join('');
      $('#learningDetail').innerHTML = `<article class="learning-lesson"><p class="eyebrow" data-i18n="ui234">YOUR STUDY DESK</p><h1 data-i18n="ui235">What should I study next?</h1><div class="study-stats"><div><strong>${reviews.length}</strong><span data-i18n="ui236">Reviews due now</span></div><div><strong>${bookmarks.length}</strong><span data-i18n="ui237">Bookmarks</span></div><div><strong>${items.filter(x=>x.kind==='course'&&state(x.id).completed).length} / 20</strong><span data-i18n="ui318">Course guides reviewed</span></div></div><section class="study-section"><h2 data-i18n="ui238">One useful next step</h2>${reviews.length ? '<p data-i18n="ui325">Start with one due review. Answer from memory, reveal the reference, then rate your recall.</p>' + cards(reviews.slice(0,1)) : next ? '<p data-i18n="ui326">No reviews are due. Continue your first incomplete roadmap week, or choose a bookmarked topic for your next class.</p>' + cards([next]) : '<p data-i18n="ui327">Your roadmap is complete. Revisit your readiness guide and focus on remaining gaps.</p>' + cards(items.filter(x=>x.id==='reference-9'))}</section><section class="study-section"><h2 data-i18n="ui239">Due now</h2>${cards(reviews) || '<p data-i18n="ui328">No due reviews. Open a lesson and choose Add to review queue to start.</p>'}</section><section class="study-section"><h2 data-i18n="ui237">Bookmarks</h2>${cards(bookmarks) || '<p data-i18n="ui329">No bookmarks yet. Use ☆ Bookmark lesson on a course, term, chapter or guide.</p>'}</section><section class="study-section"><h2 data-i18n="ui240">Next scheduled reviews</h2>${cards(upcoming.slice(0,5)) || '<p data-i18n="ui330">No future reviews scheduled.</p>'}</section><p class="muted">The simple schedule uses 1, 3, 7, 14 and 30-day steps after successful recall. Again resets to 10 minutes; With hints schedules 1 day. These are adjustable study habits through your ratings, not a prediction of mastery. Due lists refresh when you open this dashboard; no notifications run while the app is closed. Your device clock determines due times.</p><p class="study-backup">Protect your work: use Export backup regularly. Bookmarks and review schedules are included. Restoring into an older app version may discard these new fields; use this version or newer.</p></article>`;
    }
    return { mount, dashboard, queue };
  }
  root.VaultStudy = { create, due, grade, recall };
  if (typeof module !== 'undefined') module.exports = root.VaultStudy;
})(typeof window !== 'undefined' ? window : globalThis);
