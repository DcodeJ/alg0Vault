/* Read-only lessons: no new storage keys and no changes to personal study data. */
window.VaultPatterns = {
  create({ escape: esc, highlight, copyText, createStudyNote, getLanguage = () => 'csharp' }) {
    const all = window.ALG0_PATTERNS;
    const $ = selector => document.querySelector(selector);
    let selected = all[0]?.id;
    const questions = window.ALG0_QUESTIONS;
    const byId = new Map(all.map(p => [p.id, p]));
    const questionsById = new Map(questions.map(q => [q.id, q]));
    const patternIndex = new Map(all.map(p => [p.id,
      [p.title, p.group, p.cue, p.idea, ...p.practice.flatMap(q => [q.title, q.approach])].join(' ').toLowerCase()]));
    const questionIndex = new Map(questions.map(q => [q.id,
      [q.title, q.brief, ...q.guides.flatMap(g => [g.approach, byId.get(g.pattern).title])].join(' ').toLowerCase()]));
    const highlightedTemplates = new Map();
    const tutorialStates = new Map();
    let detailKey = null;
    let mode = 'patterns', selectedQuestion = questions[0]?.id;
    const groups = [
      ['Arrays & strings', 'Contiguous range? Try a window. Exact sums with negatives? Try prefix sums. Sorted pairs? Try two pointers.'],
      ['Search & ordering', 'Monotone condition? Binary search. Next greater item? Monotonic stack. Best item repeatedly? Heap.'],
      ['Trees & graphs', 'Equal-cost shortest steps? BFS. Nonnegative weighted paths? Dijkstra. Prerequisites? Topological sort.'],
      ['Decisions & optimization', 'All possibilities? Backtracking. Repeated states? DP. A provably safe local choice? Greedy.']
    ];
    const list = values => `<ul>${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;
    function filtered() {
      const query = $('#patternSearch').value.trim().toLowerCase();
      const group = $('#patternGroup').value;
      return all.filter(p => (!group || p.group === group) && (!query ||
        patternIndex.get(p.id).includes(query)));
    }
    function template(p) {
      if (getLanguage() !== 'csharp') return VaultLanguages.pattern(p.id, getLanguage());
      return 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\n' +
        '// Adapt method names, inputs, and node types to the question.\n' +
        'public class Solution\n{\n' + p.code.split('\n').map(line => '    ' + line).join('\n') + '\n}';
    }
    function highlightedTemplate(p) {
      const key = p.id + ':' + getLanguage();
      if (!highlightedTemplates.has(key)) highlightedTemplates.set(key, highlight(template(p),getLanguage()));
      return highlightedTemplates.get(key);
    }
    function roadmap() {
      return `<details class="pattern-roadmap"><summary data-i18n="ui184">New question? Start with this decision guide</summary>
        <p class="muted">Patterns are hypotheses, not guarantees. Some questions combine several patterns or require techniques outside these 24 guides.</p>
        <ol class="solve-checklist">
          <li><strong>Clarify:</strong> inputs, output, constraints, duplicates, negatives, and whether mutation is allowed.</li>
          <li><strong>Baseline:</strong> describe brute force and identify the repeated work.</li>
          <li><strong>Choose:</strong> use the clues below, then state the invariant or recurrence that makes the approach correct.</li>
          <li><strong>Verify:</strong> walk through a tiny example before writing code.</li>
          <li><strong>Analyze:</strong> bound time and memory against the constraints; include recursion and output space.</li>
          <li><strong>Test:</strong> empty/single item, duplicates, no solution, all-equal, boundaries, and numeric overflow.</li>
        </ol>
        <div class="pattern-decision-grid">${groups.map(([group, cue]) => `<button class="pattern-decision" data-pattern-group="${esc(group)}"><strong>${esc(group)}</strong><span>${esc(cue)}</span></button>`).join('')}</div>
        <p class="muted">Suggested order: arrays and hashing → windows and pointers → search and ordering → trees and graphs → backtracking and DP. Re-solve without the template and explain why a competing pattern fails.</p>
      </details>`;
    }
    function tutorial(p) {
      const lesson = window.ALG0_TUTORIALS[p.id];
      return `<section class="guided-tutorial" aria-label="Guided pattern tutorial">
        <div class="tutorial-heading"><div><p class="eyebrow" data-i18n="ui185">LEARN BY REASONING</p><h2 data-i18n="ui186">From idea to implementation</h2></div><span class="badge accent" data-i18n="ui187">Guided tutorial</span></div>
        <div class="tutorial-concepts"><div><h3 data-i18n="ui188">What it is</h3><p>${esc(lesson.definition)}</p></div><div><h3 data-i18n="ui189">What to keep track of</h3><p>${esc(lesson.state)}</p></div></div>
        <div class="tutorial-fit"><h3 data-i18n="ui190">Use it when…</h3><p>${esc(p.cue)}</p><h3 data-i18n="ui191">Check before using it</h3><p>${esc(p.pitfalls[0])}</p></div>
        <div class="tutorial-trace"><div class="section-row"><h3 data-i18n="ui192">Walk it through</h3><span id="tutorialPosition"></span></div><p id="tutorialFrame" aria-live="polite"></p><div class="tutorial-controls"><button id="tutorialPrevious" class="ghost" data-i18n="ui193">← Previous</button><button id="tutorialNext" class="primary" data-i18n="ui195">Next step →</button></div></div>
        <div class="tutorial-check"><h3 data-i18n="ui196">Check your understanding</h3><p>${esc(lesson.question)}</p><div class="tutorial-answers">${lesson.options.map((option,i)=>`<button class="ghost" data-tutorial-answer="${i}" aria-pressed="false">${esc(option)}</button>`).join('')}</div><p id="tutorialFeedback" role="status"></p></div>
      </section>`;
    }
    function refreshTutorial(p) {
      const lesson = window.ALG0_TUTORIALS[p.id];
      const state = tutorialStates.get(p.id) || { step: 0, answer: null };
      tutorialStates.set(p.id, state);
      $('#tutorialFrame').textContent = lesson.walkthrough[state.step];
      $('#tutorialPosition').textContent = `Step ${state.step + 1} of ${lesson.walkthrough.length}`;
      $('#tutorialPrevious').disabled = state.step === 0;
      $('#tutorialNext').disabled = state.step === lesson.walkthrough.length - 1;
      $('#tutorialFeedback').textContent = state.answer === null ? 'Choose an answer to see the reasoning.' :
        (state.answer === lesson.answer ? 'Correct. ' : 'Not quite. ') + lesson.explanation;
      $('#tutorialFeedback').dataset.result = state.answer === null ? '' : state.answer === lesson.answer ? 'correct' : 'retry';
      document.querySelectorAll('[data-tutorial-answer]').forEach(button => {
        button.setAttribute('aria-pressed', String(Number(button.dataset.tutorialAnswer) === state.answer));
      });
      $('#tutorialPrevious').onclick = () => { state.step = Math.max(0,state.step-1); refreshTutorial(p); };
      $('#tutorialNext').onclick = () => { state.step = Math.min(lesson.walkthrough.length-1,state.step+1); refreshTutorial(p); };
    }
    function detail(p) {
      const key = 'pattern:' + getLanguage() + ':' + (p?.id || 'empty');
      if (detailKey === key) return;
      detailKey = key;
      if (!p) { $('#patternDetail').innerHTML = '<div class="empty"><h2 data-i18n="ui180">No matching patterns</h2><p data-i18n="ui181">Try a broader clue or reset the filters.</p></div>'; return; }
      $('#patternDetail').innerHTML = `<article class="pattern-lesson">
        ${roadmap()}
        <header class="pattern-hero"><div class="badges"><span class="badge accent">${esc(p.group)}</span><span class="badge">${esc(p.level)}</span></div>
          <h1>${esc(p.title)}</h1><p>${esc(p.idea)}</p><div class="pattern-complexity">${esc(p.complexity)}</div>
        </header>
        ${tutorial(p)}
        <div class="pattern-two-col">
          <section class="pattern-panel"><h2 data-i18n="ui198">01 / Recognition clues</h2><p>${esc(p.cue)}</p></section>
          <section class="pattern-panel invariant-panel"><h2 data-i18n="ui199">02 / Why it works</h2><p>${esc(p.invariant)}</p></section>
        </div>
        <section class="pattern-panel"><h2 data-i18n="ui200">03 / Solving recipe</h2><ol class="solve-checklist">${p.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol></section>
        <section class="pattern-panel worked-example"><h2 data-i18n="ui201">04 / Walk through an example</h2><p>${esc(p.example)}</p></section>
        <section class="pattern-panel"><h2 data-i18n="ui202">05 / Common traps & limitations</h2>${list(p.pitfalls)}</section>
        <section class="pattern-code-section"><div class="section-row"><h2 data-i18n-live>06 / ${VaultLanguages.label(getLanguage())} reference template</h2><button id="copyPatternCode" class="ghost">Copy ${VaultLanguages.label(getLanguage())}</button></div>
          <p class="muted">A complete example of this pattern—not a drop-in answer for every variant. ${getLanguage() === 'csharp' ? 'Uses .NET 6+ APIs.' : getLanguage() === 'cpp' ? 'Uses C++17 and the standard library; supply a main function when running standalone. Node pointers are non-owning.' : 'Uses Python 3 and its standard library. Deep recursive examples may require an iterative approach.'} Adapt the required signature and supplied node types. String templates follow each language’s character model; C++ examples use byte-oriented strings.</p>
          <pre class="codebox"><code>${highlightedTemplate(p)}</code></pre>
        </section>
        <section class="pattern-panel"><h2 data-i18n="ui203">07 / Apply it to real questions</h2><p class="muted">Original solving outlines, not copied editorials. Variants may require additional patterns.</p>
          <div class="pattern-questions">${p.practice.map(q => `<details class="pattern-question"><summary>${esc(q.title)}</summary><p>${esc(q.approach)}</p><p class="subtle">Your turn: define the state, justify the update rule, state complexity, and test an edge case before checking a solution.</p></details>`).join('')}</div>
          <button id="patternStudyNote" class="primary" data-i18n="ui204">Create a study thread</button>
        </section>
        <footer class="pattern-panel"><h2 data-i18n="ui205">Connect the patterns</h2><div class="pattern-related">${p.next.map(id => { const next = byId.get(id); return `<button class="ghost" data-related-pattern="${esc(id)}">${esc(next.title)} →</button>`; }).join('')}</div>
          <p class="subtle">External resources (Internet required): <a href="https://leetcode.com/studyplan/leetcode-75/" target="_blank" rel="noopener noreferrer">Official LeetCode 75 study plan</a> · <a href="https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.priorityqueue-2" target="_blank" rel="noopener noreferrer">C# PriorityQueue reference</a>. Independent learning material; not affiliated with LeetCode.</p>
        </footer>
      </article>`;
      refreshTutorial(p);
      $('#copyPatternCode').onclick = () => copyText(template(p));
      $('#patternStudyNote').onclick = () => createStudyNote(p);
    }
    function questionDetail(q) {
      const key = 'question:' + (q?.id || 'empty');
      if (detailKey === key) return;
      detailKey = key;
      if (!q) {
        $('#patternDetail').innerHTML = '<div class="empty"><h2 data-i18n="ui182">No matching questions</h2><p data-i18n="ui183">Try another search or reset the filters.</p></div>';
        return;
      }
      $('#patternDetail').innerHTML = `<article class="pattern-lesson">
        <header class="pattern-hero"><span class="badge accent">Study question ${q.id} / ${questions.length}</span><h1>${esc(q.title)}</h1><p data-i18n="ui210">Read the problem first. Explain your own approach before revealing the hints.</p></header>
        <section class="pattern-panel"><h2 data-i18n="ui206">The question</h2><p>${esc(q.brief)}</p><p class="question-note">Original condensed brief. Study-list numbers are not official LeetCode IDs. These guides do not include every original constraint or a separate solution for each question.</p></section>
        <section class="pattern-panel"><h2 data-i18n="ui207">Your solving checklist</h2><ol class="solve-checklist"><li data-i18n="ui211">Clarify constraints and create a small example.</li><li data-i18n="ui212">Describe brute force and its bottleneck.</li><li data-i18n="ui213">Choose a pattern; justify its invariant or recurrence.</li><li data-i18n="ui214">Write code, analyze time and space, and test edge cases.</li></ol></section>
        <section class="pattern-panel"><h2 data-i18n="ui208">Hints &amp; related templates</h2>${q.guides.map(g => {
          const p = byId.get(g.pattern);
          return `<details class="pattern-question"><summary data-i18n="ui209">Reveal a solving approach</summary><p>${esc(g.approach)}</p><button class="ghost question-template" data-related-pattern="${esc(p.id)}">Open ${esc(p.title)} →</button></details>`;
        }).join('')}</section>
      </article>`;
    }
    function renderQuestions(resetScroll) {
      const previousKey = detailKey;
      const query = $('#patternSearch').value.trim().toLowerCase();
      const group = $('#patternGroup').value;
      const matches = questions.filter(q =>
        (!group || q.guides.some(g => byId.get(g.pattern).group === group)) &&
        (!query || questionIndex.get(q.id).includes(query)));
      if (!matches.some(q => q.id === selectedQuestion)) selectedQuestion = matches[0]?.id;
      $('#patternCount').textContent = `${matches.length} / ${questions.length} questions`;
      $('#patternList').innerHTML = matches.map(q => `<button class="pattern-card ${q.id === selectedQuestion ? 'selected' : ''}" data-question="${q.id}" aria-pressed="${q.id === selectedQuestion}"><span class="pattern-card-group">Study question ${q.id}</span><strong>${esc(q.title)}</strong><span>${esc(q.brief)}</span></button>`).join('') || '<div class="empty" data-i18n="ui319">No matches. Try another search.</div>';
      questionDetail(questionsById.get(selectedQuestion));
      if (resetScroll && detailKey !== previousKey) $('#patternDetail').scrollTop = 0;
    }
    function render(resetScroll = false) {
      const previousKey = detailKey;
      $('#browsePatterns').setAttribute('aria-pressed', String(mode === 'patterns'));
      $('#browseQuestions').setAttribute('aria-pressed', String(mode === 'questions'));
      if (mode === 'questions') { renderQuestions(resetScroll); return; }
      const matches = filtered();
      if (!matches.some(p => p.id === selected)) selected = matches[0]?.id;
      $('#patternCount').textContent = `${matches.length} / ${all.length} patterns`;
      $('#patternList').innerHTML = matches.map(p => `<button class="pattern-card ${p.id === selected ? 'selected' : ''}" data-pattern="${esc(p.id)}" aria-pressed="${p.id === selected}"><span class="pattern-card-group" data-i18n-live>${esc(p.group)}</span><strong>${esc(p.title)}</strong><span>${esc(p.cue)}</span><small>${p.practice.length} question guides · ${VaultLanguages.label(getLanguage())} template</small></button>`).join('') || '<div class="empty" data-i18n="ui320">No matches. Try another clue.</div>';
      detail(byId.get(selected));
      if (resetScroll && detailKey !== previousKey) $('#patternDetail').scrollTop = 0;
    }
    $('#patternList').onclick = event => {
      const question = event.target.closest('[data-question]');
      if (question) { selectedQuestion = Number(question.dataset.question); render(true); $('#patternDetail').scrollIntoView?.({ block: 'nearest' }); return; }
      const card = event.target.closest('[data-pattern]');
      if (!card) return;
      selected = card.dataset.pattern; render(true);
      $('#patternDetail').scrollIntoView?.({ block: 'nearest' });
    };
    $('#patternDetail').onclick = event => {
      const answer = event.target.closest('[data-tutorial-answer]');
      if (answer && mode === 'patterns') {
        const value = Number(answer.dataset.tutorialAnswer);
        const lesson = window.ALG0_TUTORIALS[selected];
        if (lesson && Number.isInteger(value) && value >= 0 && value < lesson.options.length) {
          tutorialStates.get(selected).answer = value;
          refreshTutorial(byId.get(selected));
        }
        return;
      }
      const related = event.target.closest('[data-related-pattern]');
      const family = event.target.closest('[data-pattern-group]');
      if (related) {
        mode = 'patterns';
        selected = related.dataset.relatedPattern;
        $('#patternSearch').value = ''; $('#patternGroup').value = ''; render(true);
      } else if (family) {
        $('#patternSearch').value = ''; $('#patternGroup').value = family.dataset.patternGroup; render(true);
      }
    };
    $('#patternSearch').oninput = () => render(true);
    $('#patternGroup').onchange = () => render(true);
    $('#resetPatterns').onclick = () => { $('#patternSearch').value = ''; $('#patternGroup').value = ''; render(true); };
    $('#browsePatterns').onclick = () => { mode = 'patterns'; render(true); };
    $('#browseQuestions').onclick = () => { mode = 'questions'; render(true); };
    return { render };
  }
};
