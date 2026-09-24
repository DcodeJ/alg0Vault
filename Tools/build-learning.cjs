// Offline content bundler. Run: node Tools/build-learning.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'StudyContent', name), 'utf8').replace(/\r\n/g, '\n');
const slug = text => text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
const roadmap = read('roadmap.md');
const video = read('video-notes.md');
const sections = [...roadmap.matchAll(/^## (\d+)\. (.+)$/gm)].map((m, i, all) => ({
  id: 'reference-' + m[1], kind: 'reference', title: m[2], group: 'Roadmap reference',
  markdown: roadmap.slice(m.index, all[i + 1]?.index ?? roadmap.length).trim()
}));
const plan = sections.find(s => s.id === 'reference-5').markdown;
const phases = [...plan.matchAll(/^### (Phase ([A-J]) .+)$/gm)].map((m, i, all) => ({
  title: m[1], letter: m[2], markdown: plan.slice(m.index, all[i + 1]?.index ?? plan.length).trim()
}));
const weeks = phases.flatMap(phase => [...phase.markdown.matchAll(/^\| (\d+) \| (.+) \| (.+) \|$/gm)].map(m => ({
  id: 'week-' + m[1].padStart(2, '0'), kind: 'week', number: +m[1],
  title: 'Week ' + m[1] + ' · ' + m[3], group: 'Phase ' + phase.letter,
  markdown: `## Learn in order\n\n${m[2].split('; ').map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n## Build this\n\n${m[3]}\n\n## Your study session\n\n1. Recall yesterday’s idea for 10 minutes.\n2. Study one concept for 20 minutes using the phase resources below.\n3. Build for 45 minutes.\n4. Test normal, boundary and invalid inputs; explain and record the result for 15 minutes.\n\n## Before marking this week complete\n\n- Demonstrate the deliverable without a tutorial solution.\n- Explain your code and test at least one failure case.\n- Record a commit or other evidence and a remaining question in your notes.\n- At the final week of a phase, also pass its completion task below.\n\n## Phase guidance and assessment\n\n${phase.markdown.replace(/^\|.*\n/gm, '')}`
})));
const chapterText = video.split('# Part 2 — Step-by-step video notes')[1].split('# Part 3 —')[0];
const chapters = [...chapterText.matchAll(/^### (\d+)\. (.+?) — \[([^\]]+)\]\(([^)]+)\)$/gm)].map((m, i, all) => {
  const before = chapterText.slice(0, m.index);
  const group = [...before.matchAll(/^## (Module .+)$/gm)].at(-1)[1];
  return { id: 'chapter-' + m[1].padStart(2, '0'), kind: 'video', number: +m[1],
    title: m[1] + '. ' + m[2].replace(/`/g, ''), group, timestamp: m[3], url: m[4],
    markdown: chapterText.slice(m.index + m[0].length, all[i + 1]?.index ?? chapterText.length).replace(/^## Module .+$/gm, '').trim()
  };
});
const glossary = require('../StudyContent/glossary.cjs').map(([title, group, week, definition, purpose, example, mistake, check]) => ({
  id: 'term-' + slug(title), kind: 'glossary', title, group, week,
  markdown: `## In plain English\n\n${definition}\n\n## Why you use it\n\n${purpose}\n\n## Small example\n\n\`\`\`csharp\n${example}\n\`\`\`\n\nExamples are small fragments; declarations may belong inside a class, and SQL/HTTP examples are shown as comments.\n\n## Common mistake\n\n${mistake}\n\n## Check your understanding\n\n${check}`
}));
const prompt = { id: 'reference-prompt', kind: 'reference', title: 'Your professional Study App prompt', group: 'Roadmap reference', markdown: read('study-app-prompt.md') };
const { courses: courseSource, sources: courseResources } = require('../StudyContent/courses.cjs');
const courses = courseSource.map(course => ({
  id: 'course-' + course.id, kind: 'course', title: course.title, english: course.english,
  group: course.family, weeks: course.weeks, related: course.related.map(id => 'course-' + id),
  markdown: `## ${course.english}\n\n${course.overview}\n\nThis is an introductory guide inferred from your course title, not your lecturer’s syllabus or an exam checklist. Compare it with your actual lectures and assignments.\n\n## Before you start\n\n${course.before}\n\n## Main points explained\n\n${course.points.map(point => '- ' + point).join('\n')}\n\n## Step-by-step practice\n\n${course.practice.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n## Recall questions\n\n${course.questions.map(([q], i) => `${i + 1}. ${q}`).join('\n')}\n\nTry answering aloud before opening the answer guidance below. Record your explanation and evidence in your personal notes.\n\n## Answer guidance\n\n${course.questions.map(([q, a], i) => `${i + 1}. **${q}** ${a}`).join('\n')}\n\n## Common mistake\n\n${course.mistake}\n\n## Further study · primary resources\n\n${course.resources.map(id => { const [label, url] = courseResources[id]; return `- [${label}](${url})`; }).join('\n')}\n\nThese links are supplementary reading, not your university’s prescribed reading list. External pages need internet access and may change; use current official guidance for real legal, business or security decisions.\n\n## When to mark this guide reviewed\n\n- Explain the main ideas in your own words.\n- Complete the small exercise and record its outcome.\n- Answer the recall questions and note any uncertainty.\n- Compare with your lecturer’s syllabus to identify missing material.\n\nReview status tracks this guide only. It does not mean that you have passed or mastered the entire university subject.`
}));
const coursesOverview = { id: 'reference-courses', kind: 'reference', title: 'University courses · how to study your 20 subjects', group: 'University study', markdown: `# Your computer-science course shelf\n\nYour Polish course names are preserved. English explanations and selected Polish terms help you connect lectures with documentation. These are general introductory guides inferred from titles; bring in your actual syllabus before deciding what an exam requires.\n\n## Start with your next class\n\n1. Select **University courses** to browse all 20 subjects. Search a Polish title, an English topic, or your own note. Polish accents are optional when searching.\n2. Read the prerequisite and main-point explanations. Highlight unfamiliar ideas in your journal.\n3. Complete the practical exercise using fictional data and an authorized local lab.\n4. Answer the recall questions before consulting their answer guidance.\n5. Record what you can explain and what you need to ask your lecturer. Mark the guide reviewed when its checks pass.\n\n## Helpful prerequisite paths\n\n- Programming → algorithms → software engineering.\n- Networking basics → advanced networking → server administration.\n- OS basics → operating systems mechanisms → server administration.\n- Data security → information-security management.\n- Programming + statistics → data analysis/ML; algorithms support AI search.\n- Web basics + databases → web applications → portal maintenance.\n- Typography + graphics/HCI → clearer reports and accessible interfaces.\n\nThese are suggested study dependencies, not semester assignments. Prioritize your real timetable and keep the .NET roadmap flexible; do not add twenty full courses to its existing weekly hour budget.\n\n## Preserve your work\n\nGuide notes and review status use the same local storage and Export backup workflow as your roadmap. A study thread is a separate place for discussion; opening it again preserves its existing content. Course review is separate from the 40-week roadmap meter.` };
const coursesPrompt = { id: 'reference-courses-prompt', kind: 'reference', title: 'Professional prompt · courses and color themes', group: 'University study', markdown: read('courses-and-themes-prompt.md') };
const videoGuide = { id: 'reference-video-guide', kind: 'reference', title: 'How to use the video notes', group: 'Roadmap reference', markdown: '## About these notes\n\nThese are previously prepared chapter-based study notes with supplementary C# examples and modern practice. They are not a verified full transcript or verbatim account of the video. Watch the linked chapter to confirm what the instructor says. The 40-week roadmap is the authoritative schedule.\n\n' + video.split('# Part 1 — How to study the video')[1].split('# Part 2 —')[0] };
const overview = { id: 'start', kind: 'reference', title: 'Start here · your next step', group: 'Getting started', markdown: `# Your C# developer learning home\n\nStart with the diagnostic, then build the validating calculator. Learn one concept, write code, test it, explain it, and record what you can do independently.\n\n## One path, at your pace\n\n40 weeks × 12 focused hours = 480 planned hours. This is a flexible estimate, not a job guarantee. Repeat a difficult week and adjust around exams. Watching a video is not the same as passing a practical assessment.\n\n## How to use this hub\n\n1. Open **Diagnostic** and **First seven days** below.\n2. Use **Continue roadmap** to open your first incomplete week.\n3. Work through its concepts and deliverable; consult related chapters and definitions.\n4. Keep your explanation, evidence and questions in the lesson notes.\n5. Mark complete only after the checks pass. Completion is reversible.\n6. Use **Export backup** in the sidebar regularly. Everything stays in this browser unless you export it.\n\n## Finding things\n\nSearch all content or filter to weeks, video chapters, glossary or reference. The reference shelf contains the full flagship specification, tools help, job search, readiness checks, resources and reusable prompts.\n\nThe browser app and downloaded reading material work offline. External courses, documentation and YouTube links need an internet connection. Video notes are chapter-based summaries with supplemental teaching, not a verified full transcript.` };
overview.markdown += '\n\n## Your university subjects\n\nUse the **University courses** button to open your 20 course guides, or open the course study guide below. Each subject includes definitions, practical work, recall questions and related lessons. Use **Appearance** to choose from 12 coordinated color themes.';
const items = [overview, ...weeks, ...chapters, ...glossary, ...sections, videoGuide, prompt, coursesOverview, ...courses, coursesPrompt];
for (const [id, translations] of Object.entries(require('../StudyContent/lesson-translations.cjs'))) {
  const item = items.find(item => item.id === id);
  if (!item) throw Error('Unknown translated lesson: ' + id);
  for (const language of ['csharp', 'cpp', 'python']) {
    if (typeof translations[language] !== 'string' || !translations[language].includes('```' + language + '\n'))
      throw Error('Missing lesson implementation: ' + id + ' / ' + language);
  }
  item.markdown = translations.csharp;
  item.translations = translations;
}
if (courses.length !== 20) throw Error('Expected exactly 20 university course guides');
for (const course of courses) for (const id of course.related) if (!courses.some(x => x.id === id)) throw Error('Unknown related course: ' + id);
if (weeks.length !== 40 || chapters.length !== 50 || phases.length !== 10) throw Error('Incomplete curriculum');
if (new Set(items.map(x => x.id)).size !== items.length) throw Error('Duplicate learning IDs');
const anchors = {};
for (const section of sections) for (const m of section.markdown.matchAll(/^#{1,6} (.+)$/gm)) anchors[slug(m[1])] = section.id;
const output = { version: 1, items, anchors };
fs.writeFileSync(path.join(root, 'WebApp/learning-data.js'), '/* Generated by Tools/build-learning.cjs. No network required. */\nwindow.VAULT_LEARNING = ' + JSON.stringify(output, null, 2) + ';\n');
console.log(`Bundled ${weeks.length} weeks, ${chapters.length} chapters, ${glossary.length} terms, ${courses.length} courses and ${sections.length + 5} reference pages.`);
