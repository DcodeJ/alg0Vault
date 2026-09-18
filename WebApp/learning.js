/* Offline learning UI. All document text is escaped; no HTML from content is trusted. */
(function (root) {
  'use strict';
  const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const slug = text => text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
  const searchText = text => String(text ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l');
  function inline(text) {
    const rx = /`([^`]+)`|\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let result = '', offset = 0;
    for (const m of text.matchAll(rx)) {
      result += escape(text.slice(offset, m.index));
      if (m[1] !== undefined) result += '<code>' + escape(m[1]) + '</code>';
      else if (m[2] !== undefined) {
        const url = m[3];
        if (/^https?:\/\//i.test(url)) result += `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(m[2])}</a>`;
        else if (/^#[\p{L}\p{N}_-]+$/u.test(url)) result += `<a href="${escape(url)}" data-learning-anchor="${escape(url.slice(1))}">${escape(m[2])}</a>`;
        else result += escape(m[2]);
      } else if (m[4] !== undefined) result += '<strong>' + escape(m[4]) + '</strong>';
      else result += '<em>' + escape(m[5]) + '</em>';
      offset = m.index + m[0].length;
    }
    return result + escape(text.slice(offset));
  }
  function markdown(source, highlight = escape) {
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    const result = []; let paragraph = [], list = '';
    const flush = () => { if (paragraph.length) { result.push('<p>' + inline(paragraph.join(' ')) + '</p>'); paragraph = []; } };
    const closeList = () => { if (list) { result.push('</' + list + '>'); list = ''; } };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*```/.test(line)) {
        flush(); closeList(); const language = line.trim().slice(3).toLowerCase(), code = [];
        while (++i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i]);
        result.push('<pre><code>' + (language === 'csharp' || language === 'cs' ? highlight(code.join('\n')) : escape(code.join('\n'))) + '</code></pre>');
      } else if (/^\|/.test(line) && /^\|[\s:|\-]+\|\s*$/.test(lines[i + 1] || '')) {
        flush(); closeList();
        const cells = row => row.trim().replace(/^\||\|$/g, '').split(/\|(?=(?:[^`]*`[^`]*`)*[^`]*$)/).map(x => x.trim());
        result.push('<div class="learning-table-wrap"><table><thead><tr>' + cells(line).map(x => '<th scope="col">' + inline(x) + '</th>').join('') + '</tr></thead><tbody>');
        i++;
        while (i + 1 < lines.length && /^\|/.test(lines[i + 1])) result.push('<tr>' + cells(lines[++i]).map(x => '<td>' + inline(x) + '</td>').join('') + '</tr>');
        result.push('</tbody></table></div>');
      } else if (/^#{1,6} /.test(line)) {
        flush(); closeList(); const m = /^(#{1,6}) (.+)$/.exec(line), level = m[1].length;
        result.push(`<h${level} id="learning-heading-${slug(m[2])}">${inline(m[2])}</h${level}>`);
      } else if (/^\s*(?:[-*] |\d+\. )/.test(line)) {
        flush(); const ordered = /^\s*\d+\. /.test(line), type = ordered ? 'ol' : 'ul';
        if (list !== type) { closeList(); list = type; const start = ordered ? Number(/^\s*(\d+)/.exec(line)[1]) : 1; result.push(`<${type}${ordered ? ` start="${start}"` : ''}>`); }
        result.push('<li>' + inline(line.replace(/^\s*(?:[-*] |\d+\. )/, '').replace(/^\[ \] /, '☐ ').replace(/^\[x\] /i, '☑ ')) + '</li>');
      } else if (/^> ?/.test(line)) { flush(); closeList(); result.push('<blockquote>' + inline(line.replace(/^> ?/, '')) + '</blockquote>');
      } else if (/^\s*---+\s*$/.test(line)) { flush(); closeList(); result.push('<hr>');
      } else if (!line.trim()) { flush(); closeList(); }
      else { closeList(); paragraph.push(line.trim()); }
    }
    flush(); closeList(); return result.join('\n');
  }
  function create(options) {
    const $ = selector => document.querySelector(selector);
    const data = root.VAULT_LEARNING, items = data.items, byId = new Map(items.map(x => [x.id, x]));
    let selectedId = 'start';
    const state = id => options.getProgress().find(x => x.id === id) || { id, completed: false, notes: '' };
    const link = (id, title) => `<button class="ghost" data-learning-id="${escape(id)}">${escape(title || byId.get(id)?.title || id)}</button>`;
    const completed = kind => items.filter(x => x.kind === kind && state(x.id).completed).length;
    const nextWeek = () => items.find(x => x.kind === 'week' && !state(x.id).completed);
    function filtered() {
      const words = searchText($('#learningSearch').value).trim().split(/\s+/).filter(Boolean), kind = $('#learningKind').value;
      const status = $('#learningStatus').value;
      return items.filter(item => (!kind || item.kind === kind)
        && (status !== 'bookmarked' || state(item.id).bookmarked)
        && (status !== 'due' || (item.kind !== 'reference' && VaultStudy.due(state(item.id))))
        && (status !== 'unfinished' || (item.kind !== 'reference' && !state(item.id).completed))
        && words.every(word => searchText(`${item.title} ${item.english || ''} ${item.group} ${item.markdown} ${state(item.id).notes}`).includes(word)));
    }
    function renderList() {
      const visible = filtered();
      $('#learningCount').textContent = `${visible.length} / ${items.length} entries`;
      $('#learningProgress').textContent = `${completed('week')} / 40 weeks · ${completed('video')} / 50 chapters`;
      $('#learningMeter').value = completed('week');
      $('#courseProgress').textContent = `${completed('course')} / 20 guides reviewed`;
      $('#learningContinue').textContent = nextWeek() ? `Continue · Week ${nextWeek().number}` : 'All weeks complete · review readiness';
      $('#learningList').innerHTML = visible.map(x => `<button class="learning-card ${x.id === selectedId ? 'selected' : ''}" data-learning-id="${escape(x.id)}" aria-current="${x.id === selectedId ? 'true' : 'false'}"><small>${escape(x.group)}${x.timestamp ? ' · ' + escape(x.timestamp) : ''}</small><strong>${state(x.id).completed ? '✓ ' : ''}${escape(x.title)}</strong><small>${x.kind === 'week' ? 'Learn → build → test → explain' : x.kind === 'video' ? 'Chapter notes + practice' : x.kind === 'glossary' ? 'Definition + example + recall' : 'Guide & reference'}</small></button>`).join('') || '<p class="empty" data-i18n="ui215">No matches. Try a shorter search or reset the filters.</p>';
      return visible;
    }
    function related(item) {
      let result = [];
      if (item.id === 'start') result = [link('reference-courses', 'University courses · study guide'), link('reference-1', 'Diagnostic'), link('reference-4', 'First seven days'), link('week-01', 'Week 1'), link('reference-12', 'Learning resources'), link('reference-prompt', 'Professional prompt'), link('reference-courses-prompt', 'Courses & themes prompt')];
      if (item.id === 'reference-courses') result = items.filter(x => x.kind === 'course').map(x => link(x.id));
      if (item.kind === 'course') {
        result = [link('reference-courses', 'Course study guide'), ...item.related.map(id => link(id)), ...item.weeks.map(week => link('week-' + String(week).padStart(2, '0'), '.NET roadmap · week ' + week))];
      }
      if (item.kind === 'glossary') result = [link('week-' + String(item.week).padStart(2, '0'), 'Apply this in week ' + item.week)];
      if (item.kind === 'week') {
        result.push(link('reference-12', 'Resource library'));
        if (item.number === 1) result.push(link('reference-1', 'Diagnostic'), link('reference-4', 'First seven days'));
        if (item.number >= 5) result.push(link('reference-6', 'OrderDesk specification'));
        if (item.number >= 20) result.push(link('reference-8', 'Applications & interviews'));
        const ranges = item.number <= 2 ? [1,17] : item.number <= 4 ? [18,30] : item.number <= 6 ? [31,39] : item.number <= 8 ? [40,49] : item.number === 12 ? [50,50] : null;
        const chapters = ranges ? items.filter(x => x.kind === 'video' && x.number >= ranges[0] && x.number <= ranges[1]) : [];
        const terms = items.filter(x => x.kind === 'glossary' && x.week === item.number);
        return '<div class="learning-links">' + result.join('') + '</div>' + (terms.length ? '<h2 data-i18n="ui322">Terms for this week</h2><div class="learning-links">' + terms.map(x => link(x.id)).join('') + '</div>' : '') + (chapters.length ? '<details><summary data-i18n="ui323">Companion video chapters for this study block</summary><div class="learning-links">' + chapters.map(x => link(x.id)).join('') + '</div></details>' : '');
      }
      if (item.kind === 'video') {
        const week = item.number <= 17 ? 1 : item.number <= 30 ? 3 : item.number <= 39 ? 5 : item.number <= 49 ? 7 : 12;
        result = [link('week-' + String(week).padStart(2,'0'), 'Apply this · week ' + week + ' study block'), link('reference-video-guide', 'How to study the video')];
        const terms = items.filter(x => x.kind === 'glossary' && x.week === week).slice(0,6);
        result.push(...terms.map(x => link(x.id)));
      }
      return result.length ? '<div class="learning-links">' + result.join('') + '</div>' : '';
    }
    function renderDetail() {
      if (selectedId === 'today') { studyTools.dashboard(); return; }
      const item = byId.get(selectedId);
      if (!item) { $('#learningDetail').innerHTML = '<p class="empty" data-i18n="ui321">No matching lessons. Reset the filters to return to your roadmap.</p>'; return; }
      const progress = state(item.id), trackable = ['week','video','glossary','course'].includes(item.kind);
      const sequence = items.filter(x => x.kind === item.kind), index = sequence.findIndex(x => x.id === item.id);
      $('#learningDetail').innerHTML = `<article class="learning-lesson"><p class="eyebrow">${escape(item.group)}</p><h1>${escape(item.title)}</h1><div class="learning-actions">${link('start', 'Learning home')}<button class="ghost" id="learningCopy" data-i18n="ui218">Copy lesson</button><button class="ghost" id="learningStudyNote" data-i18n="ui219">Open study thread</button>${trackable ? `<button id="learningComplete" class="${progress.completed ? 'secondary' : 'primary'}" aria-pressed="${progress.completed}">${progress.completed ? '✓ Completed · mark incomplete' : item.kind === 'glossary' ? 'I can explain this · mark reviewed' : 'Checks passed · mark complete'}</button>` : ''}</div>${item.kind === 'video' ? `<div class="learning-callout">Chapter-based notes with supplementary teaching, not a verified full transcript. <a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">Watch at ${escape(item.timestamp)}</a>. Read and practice offline; watching requires internet.</div>` : ''}${related(item)}<div id="studyTools"></div><div class="learning-markdown">${markdown(item.markdown, options.highlight)}</div>${item.kind === 'video' ? '<div class="learning-callout"><strong>Practice before completing:</strong> type a small example, predict its output, change two values, test a failure case, and rebuild the important part without the video. Explain what happened in your own words.</div>' : ''}<section class="learning-notes"><h2 data-i18n="ui220">Your explanation & evidence</h2><label for="learningJournal" data-i18n="ui221">What I learned, what I built, tests, commit/link, and questions</label><textarea id="learningJournal" placeholder="Explain the idea in your words. Record one example, one mistake, and your next step." data-i18n-placeholder="ui332">${escape(progress.notes)}</textarea><p data-i18n="ui331">Autosaves to this browser. Check the save status above; use Export backup to protect your work. Completion is your self-assessment, not an automatic skills test.</p><button id="learningSave" class="ghost" data-i18n="ui222">Save notes now</button></section><div class="learning-actions">${index > 0 ? link(sequence[index - 1].id, '← Previous') : ''}${index >= 0 && index < sequence.length - 1 ? link(sequence[index + 1].id, 'Next →') : ''}</div></article>`;
      $('#learningCopy').onclick = () => options.copyText('# ' + item.title + '\n\n' + item.markdown);
      if (item.kind === 'course') $('#learningComplete').textContent = progress.completed ? '✓ Guide reviewed · mark unreviewed' : 'I completed this guide · mark reviewed';
      $('#learningStudyNote').onclick = () => options.createStudyNote(item, state(item.id).notes);
      if (trackable) $('#learningComplete').onclick = () => {
        options.updateProgress(item.id, { completed: !state(item.id).completed }, true); render();
      };
      $('#learningJournal').oninput = event => options.updateProgress(item.id, { notes: event.target.value }, false);
      $('#learningSave').onclick = options.flushSaves;
      studyTools.mount(item);
    }
    function open(id, resetFilters = true) {
      if (id !== 'today' && !byId.has(id)) return;
      options.flushSaves(); selectedId = id;
      if (resetFilters) { $('#learningSearch').value = ''; $('#learningKind').value = ''; $('#learningStatus').value = ''; }
      render(); $('#learningDetail').scrollTop = 0;
    }
    function render() { renderList(); renderDetail(); }
    function search() {
      options.flushSaves(); const visible = renderList();
      if (!visible.some(x => x.id === selectedId)) selectedId = visible[0]?.id;
      renderList(); renderDetail(); $('#learningDetail').scrollTop = 0;
    }
    $('#learningSearch').oninput = search; $('#learningKind').onchange = search;
    $('#learningStatus').onchange = search;
    $('#studyToday').onclick = () => open('today');
    $('#learningCourses').onclick = () => { $('#learningSearch').value = ''; $('#learningKind').value = 'course'; $('#learningStatus').value = ''; search(); };
    $('#learningReset').onclick = () => open('start');
    $('#learningContinue').onclick = () => open(nextWeek()?.id || 'reference-9');
    $('#learningList').onclick = event => { const button = event.target.closest('[data-learning-id]'); if (button) open(button.dataset.learningId, false); };
    $('#learningDetail').onclick = event => {
      const button = event.target.closest('[data-learning-id]');
      if (button) { open(button.dataset.learningId); return; }
      const anchor = event.target.closest('[data-learning-anchor]');
      if (anchor) {
        event.preventDefault(); const key = anchor.dataset.learningAnchor;
        const localHeading = $('#learning-heading-' + key);
        if (!localHeading && data.anchors[key]) open(data.anchors[key]);
        $('#learning-heading-' + key)?.scrollIntoView?.({ block: 'start' });
      }
    };
    const studyTools = VaultStudy.create({ ...options, escape, markdown: text => markdown(text, options.highlight), open, render });
    return { render, open };
  }
  root.VaultLearning = { create, markdown, inline, searchText };
  if (typeof module !== 'undefined') module.exports = root.VaultLearning;
})(typeof window !== 'undefined' ? window : globalThis);
