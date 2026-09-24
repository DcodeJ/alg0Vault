# alg0Vault

Local algorithm library, LeetCode practice guides, and semester notes.

## Start with Today

The app now opens on **Today**, a focused study desk using your existing progress:

1. **Recall:** open the oldest due lesson and test your recall in Study Hub.
2. **Learn:** continue the first unfinished roadmap week.
3. **Build:** practice an unfinished algorithm, prioritizing Essential before Core and Advanced, then fewer prior reviews. The recommendation opens that exact practice question.

**Find anything** searches algorithms, bundled lessons/definitions/course guides, and Notes Hub text including posted replies. It accepts Polish accents or plain Latin equivalents and requires every search word to match. Results open the actual item, not a separate copy. Up to 40 results are displayed; narrow your query for more precise results. Press **Ctrl+K** (or Command+K) from anywhere to jump to this search. The separate pattern/question-bank search remains in LeetCode Patterns.

**One focused session** offers 25-minute focus, 50-minute deep work and 5-minute break timers. Start, pause or reset explicitly. Timing is based on the device clock and continues across app sections; a page reload resets it. No notifications, background jobs, session history or automatic mastery credit are added.

**Your algorithm skills** summarizes your self-rated mastery by category, not an objective assessment. Interview Practice now also filters by Essential/Core/Advanced priority. Larger text, responsive Today panels and reduced-motion support extend the existing 12 appearance palettes.

Everything remains offline and local. Existing algorithms, journals, notes, reviews and JSON save-file compatibility are preserved. The Today plan and counters recalculate when you open it; they do not require a new save format. Interface checks use automated DOM doubles, not visual browser testing.

## Algorithms: what to learn first

The browser catalog includes **100 algorithms across 14 categories**, each with editable **C#, Python 3, and C++17** implementations, summaries, complexity and edge-case notes. Use **Learn essentials first**, or combine **Study priority** with category, difficulty and search filters.

- **Essential (34):** foundational searches, array/string patterns, traversals and introductory dynamic programming. Start here.
- **Core (55):** extend those foundations with heaps, greedy choices, backtracking and further graph/DP problems.
- **Advanced (11):** deeper topics such as all-pairs shortest paths, string matching, edit distance and monotonic-window techniques.

These are suggested study priorities, not universal interview requirements. Priority is editable independently of difficulty and mastery. A useful learning order is arrays/strings → searching/sorting → stacks/linked lists → trees/graphs → heaps/greedy → dynamic programming/backtracking. Mix in math and bit manipulation gradually. For each algorithm, explain its input assumptions, trace an example, implement it without copying, then test boundaries and state complexity.

**Already have a saved library? Click “Add 40 new algorithms”.** The count reflects missing pack entries. This preserves your existing algorithms, edits and progress. The app deliberately does not restore deleted algorithms automatically. New users start with all 100. The new pack adds, among others, rotated-array search, matrix search, majority vote, Prim, Floyd–Warshall, multi-source BFS, GCD, sieve, modular exponentiation, Word Break, Decode Ways, heaps, interval scheduling and histogram problems.

Editable pack source: `StudyContent/algorithm-pack.cjs`. Regenerate with `node Tools/build-algorithm-pack.cjs`. The generated C# test project exercises all 40 new implementations; it does not execute the older 60 snippets.

## Local save files — step by step

1. Open the app using `run.bat`. Your existing browser workspace still loads automatically.
2. Click **Save file** and choose a local `.json` file, such as `Study-App-save.json`. If direct file access is unavailable, the app requests a download instead.
3. Continue studying. Browser autosave and your disk file are separate: click **Save file** again to update your linked file. **Save file as…** creates or selects another copy. With download-only support, each save downloads a new copy.
4. To restore or switch workspaces, click **Open save file** and select the JSON file. Confirm replacement. The app first requests a safety-backup download of your current workspace; retain that download if you may need to return to it.
5. Reopen your file after restarting the app if you want subsequent saves to write back to it. File permissions/handles are not retained across restarts.

| Action | What happens |
| --- | --- |
| Save file / Save file as… | Saves algorithms, notes and posted replies, study journals/completion/bookmarks/recall, and theme. |
| Open save file | Replaces the workspace exactly, including deliberately empty collections. Unposted reply drafts are discarded after confirmation. |
| Export backup | Downloads a backup; does not link a writable file. |
| Import backup | Adds missing records; existing IDs win. It does not replace the workspace or change theme. |

Save files are plain JSON, not encrypted. Keep private notes out of public repositories. Files must be at most 20 MB. Attached-file contents are not included: notes retain their text and links. Old version-1 backups can also be opened; absent learning progress becomes empty and an absent theme leaves the current theme unchanged.

Direct file access depends on browser support and permissions. When unavailable, local upload/download works without a server or internet connection. The status distinguishes a confirmed direct write from a download request; downloads cannot be verified by the app. If an already-linked file changes outside the app, saving refuses to overwrite it: open it again or save another copy. Browser-storage failures during loading trigger rollback and leave the current in-memory workspace available. If recovery fails, export the current session before closing.

**Ctrl+S and Save changes still save to browser storage**, not your chosen JSON file. Use the explicit **Save file** button for disk saving. This update remains local-only; no hosting or accounts are added.

## Your study desk

Open **Study Hub → Today · review & bookmarks** for due reviews, bookmarks, the next unfinished roadmap week, course progress and the next five scheduled reviews.

- **Bookmark lesson** saves any course, chapter, term or guide for quick access. It does not change completion.
- **Add to review queue** schedules a lesson for recall. **Pause scheduled reviews** is reversible and leaves its notes and review history intact.
- **Test my recall** asks a question before revealing reference material. Courses rotate through their three existing recall questions; glossary terms use their recall prompt and definition/example. Weeks and video chapters use an explanation exercise.
- After revealing the reference, rate **Again** (10 minutes), **With hints** (1 day), or **Got it** (successive 1, 3, 7, 14 and 30-day intervals). These are simple self-rated study intervals, not a mastery prediction. Days are elapsed 24-hour periods; your device clock determines due times.
- **Study status** filters the library to bookmarks, due reviews or unfinished material. The Today dashboard gives due reviews priority over new roadmap work.

Reviews are optional and separate from marking a week complete or a course guide reviewed. No background notifications or scheduled jobs run when the app is closed. Due lists update when you open the dashboard or refresh a filter.

Bookmarks and review fields are included in existing workspace backups. Older backups import with these fields disabled by default; existing IDs still win, preserving your current work. Restore new backups into this app version or newer—older editions may discard fields they do not understand. Save failures remain visible; export your session before closing if local storage is unavailable.

## C# Learning Hub

The sidebar now calls this section **Study Hub**. Its existing C# content, progress IDs and backups are preserved.

### University courses

Choose **Study Hub → University courses** to browse all 20 subjects from your course list. Polish titles are retained; explanations are in English with selected Polish terminology. Search accepts Polish accents or plain Latin equivalents, as well as English topics and personal notes.

Each introductory guide contains prerequisites, six explained main points, a three-step practical exercise, three recall questions with answer guidance, a common mistake, primary-resource links and related course/roadmap links. Use your actual syllabus and lecture notes to determine exam coverage. The advanced OS, network and security subjects build on their introductory counterparts rather than duplicating them.

**Mark reviewed** tracks your study of the guide, not passing or mastering the entire university course. Course progress has a separate counter; it does not change the 40-week roadmap meter. Journals and review records use the existing export/import workflow. No real personal data, business registration or public-server experiments are required.

Your new professional prompt is in `StudyContent/courses-and-themes-prompt.md` and the hub's reference guides. Course content is editable in `StudyContent/courses.cjs`; regenerate the offline bundle with `node Tools/build-learning.cjs`.

### More colors

The **Appearance** selector now offers 12 themes: Current, Dark, Purple, White, Ocean, Emerald, Rose, Amber, Crimson, Slate, Sky and Paper. Sky and Paper are additional light themes; the other six additions are dark. Palettes coordinate surfaces, text, accents, buttons and focus colors, and the selected theme persists in this browser. Themes are local preferences, not part of a workspace backup.

Code previews, the code editor, practice solutions, pattern templates, lesson code blocks, and lesson tables also follow **Appearance**. Each of the 12 themes has coordinated code backgrounds, borders, syntax colors, and selection highlights. White, Sky, and Paper use light code panels. Static contrast checks require at least 4.5:1 for each syntax color and 7:1 for plain code text against its panel background; these checks do not replace visual browser testing.

The app uses a robot icon inspired by 🤖 in the browser header/tab and Windows executable/title bar. Editable artwork is `Assets/alg0vault-robot.svg`. On Windows, `Tools/build-icon.ps1` regenerates the PNG and nine-resolution ICO (16–256 px) without external dependencies. Rebuild the native app to embed icon updates. If an existing pinned Windows shortcut still shows its cached icon after restarting, unpin and repin the updated executable.

For your programming path, open **Study Hub** in the browser edition's sidebar. Start with **Diagnostic** and **First seven days**, then use **Continue roadmap** for the first incomplete week.

- 40 weekly milestones across 10 phases, using the latest 480-hour career roadmap. The timetable is adjustable and does not guarantee employment.
- 50 linked Bro Code video chapters with previously prepared notes and supplementary examples. These are chapter-based study notes, not a verified full transcript. External resources and video playback require internet; lesson text works offline.
- 70 searchable programming terms with plain-English definitions, examples, common mistakes, recall questions, and related weeks.
- Reference guides for OrderDesk, troubleshooting, job applications, interviews, readiness, resources and reusable prompts.
- Reversible completion tracking and autosaved personal explanations/evidence. **Open study thread** creates one Notes Hub thread per lesson, or opens the existing one without overwriting it. The thread initially copies your journal; later edits to the two remain independent.

**Export backup** includes learning completion and journals. Older version-1 backups remain importable. Import is additive: existing record IDs win, including progress that you deliberately marked incomplete. Browser storage errors are shown in the save status; export the current session if saving fails. Do not move the app or switch browsers without exporting first.

Editable learning sources and your professional prompt are in `StudyContent/`. After changing them, regenerate the offline bundle with `node Tools/build-learning.cjs`. The video source retains the original archived document, including its superseded schedule; only its chapter notes and study method appear in the app. `StudyContent/roadmap.md` is the current schedule.

## Run

Double-click `run.bat` or open `WebApp/index.html` in your browser. No server or Internet connection is needed for the app.

The browser edition includes 100 algorithms in C#, Python, and C++, 24 pattern guides, a bank of 100 distinct LeetCode questions with original short briefs and solving hints, interview practice, and a Notes Hub. Open **LeetCode Patterns → 100 questions** to browse the bank. Question numbers are local study-list numbers, not LeetCode IDs; this question bank is separate from the algorithm implementations.

Thread replies have a **Delete comment** button with confirmation. Deletion cannot be undone after it is saved.

## Programming languages (browser edition)

### English / Polish interface

Use **EN / PL** in the top bar to switch the interface language without reloading. The choice is remembered in this browser, separately from the C#/C++/Python code selector and Appearance. Menus, buttons, filters, common status messages, and navigation labels are localized; algorithm names/explanations, lessons, and your notes/code retain their original language. Search those materials using their original titles or wording. The interface preference is device-local, not included in workspace exports. Switching does not replace drafts, reset the timer, or change saved content. If browser storage is unavailable, the language still changes for the current session and a warning is shown.

Use **Code** in the top bar to switch between **C#** (default), **C++**, and **Python**. The preference is remembered. Each algorithm keeps independent implementations: existing C# stays in its original storage field, and C++/Python edits are saved alongside it. Backups and local save files retain all implementations; local save files also retain the selected language.

All **100 library entries and 24 pattern templates** have Python 3 and C++17 references, including all eight sorting examples, graphs, trees, linked lists, dynamic programming, strings, heaps, greedy methods, math and backtracking. There are 103 distinct examples per language because 21 library entries share a pattern template. Custom entries start with an empty slot for each added language. Reference ports use their own function signatures and comments and do not automatically incorporate your C# edits. Existing saved Python/C++ code (including deliberately empty code) takes precedence over bundled references. C# course lessons in Study Hub remain in C#.

Examples are for reading and copying; the app does not compile or execute code. **Copy code** includes the required C++ headers and any overflow-checking helpers. Add a `main()` or adapt the signature to your judge/assignment. C++ examples use byte strings and interview-sized containers; Python uses Unicode code points unless an ASCII-only domain is documented. Read each example's input assumptions, mutation behavior, and return conventions; shared C# notes may differ. Recursive backtracking can exhaust the call stack or memory on large outputs. Dynamic programs indexed by an amount/sum may need substantial memory. C++ linked-list/tree pointers are non-owning; the caller controls lifetime.

C++ references have not been compiler-verified on this machine because its C++ toolchain is unavailable. Python checks execute all 103 distinct examples, randomized sorting, and 5,701 additional randomized, boundary, and invalid-input comparisons:

```powershell
node Tests/language-examples.cjs path/to/python.exe
```

A C++ runner supplies executable checks for all 103 distinct examples, including sorting and arithmetic-overflow boundaries. Run it with an installed C++17 compiler (or `cl.exe` from a Visual Studio Developer Command Prompt):

```powershell
node Tests/cpp-language-examples.cjs g++
node Tests/cpp-language-examples.cjs clang++
```

`node Tests/cpp-language-examples.cjs --validate` checks catalog/test coverage without compiling or claiming execution. App regression tests also exercise rendering and copying all 100 entries in both languages, stable-ID lookup, saved overrides, and preservation of original C# code.

## Your data

Browser notes, algorithms, and progress are saved in local storage. Use **Export backup** before moving the app, changing browsers, or clearing browser data. Import adds missing records and keeps existing records with the same ID. Keep private backups out of GitHub.

The browser stores text notes and links, not attachment files. Native app data and attachments live separately in `%LOCALAPPDATA%\AlgorithmVault`.

## Native C# edition

Requires Windows and the .NET 10 SDK. Run `run-native.bat`, or build with:

```powershell
dotnet build AlgorithmVault.csproj -c Release
```

Windows may block unsigned native builds. The browser edition is the supported alternative in this workspace. The pattern/question bank and C# Learning Hub are browser-only. Native storage respects deleted algorithms, preserves code escape sequences, and serializes overlapping saves using unique temporary files. Invalid collection recovery keeps separate copies of the original files.

## Checks

Study Hub's **Enums** chapter (48) and **Enum** glossary entry include complete C#, C++17 and Python 3 programs, expected output, step-by-step explanations and invalid-input exercises. The programming-language selector updates the lesson, its recall reference and **Copy lesson** without clearing your journal or scroll position. Other lessons that have not been translated retain their original C# examples and show an explicit notice when another language is selected. Code-block labels and highlighting always follow the actual example language; the .NET roadmap has not been converted into a Python/C++ curriculum. Examples are for running in your own development environment, not an in-app code runner.

Developer checks for the authored enum programs (requires the corresponding runtime/compiler): `node Tests/lesson-examples.cjs python`, `node Tests/lesson-examples.cjs csharp`, or `node Tests/lesson-examples.cjs cpp`. An optional third argument supplies the executable path. These run the original example and its Offer/Rejected variations in a temporary directory; they are not automatic grading of student submissions.

LeetCode Patterns includes 24 guided tutorials: explanations, when to use the pattern, state to track, step-by-step worked examples, and self-checks with feedback. Tutorial step and answer selections last for the current session; create a study thread to keep your own notes. The 100-question bank remains available alongside the guides.

The interface uses the selected palette across the study desk, lists, notes, and tutorials. Pattern search uses precomputed indexes and retains the current lesson when results still include it, preserving expanded content during search. No AI prompt files or prompt controls are included.

```powershell
node --test Tests/web-regression.cjs Tests/theme-contrast.cjs Tests/local-files.cjs Tests/icon-assets.cjs Tests/locale.cjs
dotnet run --project Tests/AlgorithmChecks/AlgorithmChecks.csproj
dotnet run --project Tests/StorageChecks/StorageChecks.csproj
```

The tests cover data and UI events with a DOM double, plus static contrast calculations for core text/surface and primary-button pairs in the eight new palettes. They are not visual browser rendering or a complete accessibility audit.

Regression coverage includes deleted/filtered practice questions, translated lesson and reply searches, preservation of recall during search, unfinished reply warnings, pending file writes, import rollback failures and the 10,000-record collection limit. Unposted replies remain session-only; post them before exporting. The native storage checks use their own temporary directory, never the real saved vault.
