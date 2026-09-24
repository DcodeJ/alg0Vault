// Run authored lesson examples in an installed runtime, not user-submitted code.
// node Tests/lesson-examples.cjs python [python executable]
// node Tests/lesson-examples.cjs csharp [dotnet executable]
// node Tests/lesson-examples.cjs cpp [g++ or clang++ executable]
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const lessons = require('../StudyContent/lesson-translations.cjs');
const language = process.argv[2];
const runtime = process.argv[3] || { python: 'python', csharp: 'dotnet', cpp: 'g++' }[language];
if (!runtime) throw Error('Choose python, csharp or cpp (with its installed runtime/compiler).');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'alg0vault-lesson-check-'));
function run(executable, args) {
  const result = spawnSync(executable, args, { cwd: directory, encoding: 'utf8', timeout: 120000, windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error(result.stdout + '\n' + result.stderr);
  return result.stdout.replace(/\r\n/g, '\n').trim();
}
try {
  const examples = new Map();
  for (const [id, variants] of Object.entries(lessons)) {
    const code = new RegExp('```' + language + '\\n([\\s\\S]*?)```').exec(variants[language])?.[1];
    assert.ok(code, 'Missing example: ' + id);
    examples.set(code, id); // Identical chapter/glossary examples run once.
  }
  let count = 0;
  for (const [code, id] of examples) {
    for (const [state, expected] of [['Applied', 'Application submitted!\n1'], ['Offer', '3'], ['Rejected', '4']]) {
      const assignment = language === 'cpp' ? 'status = ApplicationStatus::Applied;' : 'status = ApplicationStatus.Applied' + (language === 'csharp' ? ';' : '');
      assert.ok(code.includes(assignment));
      const variant = code.replace(assignment, assignment.replace('Applied', state));
      let output;
      if (language === 'python') {
        fs.writeFileSync(path.join(directory, 'example.py'), variant);
        output = run(runtime, ['example.py']);
      } else if (language === 'csharp') {
        const major = Number(run(runtime, ['--version']).split('.')[0]);
        assert.ok(major >= 6, 'A .NET 6+ SDK is required');
        fs.writeFileSync(path.join(directory, 'LessonCheck.csproj'), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net${major}.0</TargetFramework><NuGetAudit>false</NuGetAudit></PropertyGroup></Project>`);
        fs.writeFileSync(path.join(directory, 'Program.cs'), variant);
        run(runtime, ['build', 'LessonCheck.csproj', '-o', 'out', '--nologo', '-v', 'quiet']);
        output = run(runtime, [path.join(directory, 'out', 'LessonCheck.dll')]);
      } else {
        fs.writeFileSync(path.join(directory, 'example.cpp'), variant);
        const binary = path.join(directory, process.platform === 'win32' ? 'example.exe' : 'example');
        run(runtime, ['-std=c++17', '-Wall', '-Wextra', '-pedantic', 'example.cpp', '-o', binary]);
        output = run(binary, []);
      }
      assert.equal(output, expected, id + ': ' + state);
      count++;
    }
  }
  console.log(`${language}: ${count} executed output checks passed (${Object.keys(lessons).length} lesson entries).`);
} finally {
  // Only remove the exact, uniquely created test directory; never touch study data.
  fs.rmSync(directory, { recursive: true, force: true });
}
