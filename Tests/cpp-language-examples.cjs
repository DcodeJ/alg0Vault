// Usage: node Tests/cpp-language-examples.cjs [g++|clang++|path-to-compiler]
// Run cl.exe from a Developer Command Prompt. --validate checks coverage only.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
for (const file of ['algorithms.js', 'algorithm-pack.js', 'language-samples.js', 'languages.js'])
  vm.runInNewContext(fs.readFileSync(path.join(root, 'WebApp', file), 'utf8'), context);
const { ALG0_LANGUAGE_SAMPLES: samples, ALG0_ALGORITHMS: catalog, VaultLanguages: languages } = context.window;
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, 'reference-cpp-cases.json'), 'utf8'));
const extra = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-language-cases.json'), 'utf8'));
for (const [title, pair] of Object.entries(extra)) cases.algorithms[title] = pair.cpp;
const units = [];
for (const [id] of Object.entries(samples.patterns))
  units.push({ name: 'pattern: ' + id, code: languages.pattern(id, 'cpp'), checks: cases.patterns[id] });
for (const [title] of Object.entries(samples.algorithms)) {
  const record = catalog.find(a => a.title === title);
  assert.ok(record, 'No catalog entry for ' + title);
  units.push({ name: title, code: languages.get(record, 'cpp').code, checks: cases.algorithms[title] });
}
assert.equal(units.length, 103);
assert.equal(catalog.length, 100);
for (const row of catalog) assert.equal(languages.get(row, 'cpp').source, 'reference', row.title);
for (const unit of units) {
  assert.ok(unit.code.includes('#include <vector>'), unit.name);
  assert.ok(unit.checks && unit.checks.includes('check('), 'Missing tests: ' + unit.name);
}
const headers = new Set(['#include <iostream>', '#include <random>']);
const definitions = units.map((unit, i) => {
  const code = unit.code.replace(/^#include <[^>]+>$/gm, header => { headers.add(header); return ''; });
  let boundaryChecks = '';
  if (code.includes('inline long long checkedAdd(')) boundaryChecks += `
    check(checkedAdd(numeric_limits<long long>::min(),0)==numeric_limits<long long>::min());
    check(checkedAdd(numeric_limits<long long>::max(),-1)==numeric_limits<long long>::max()-1);
    for (auto operands:vector<pair<long long,long long>>{{numeric_limits<long long>::max(),1},{numeric_limits<long long>::min(),-1}}) {
      bool threw=false; try { checkedAdd(operands.first,operands.second); } catch(const overflow_error&) {threw=true;} check(threw);
    }`;
  if (code.includes('inline long long checkedMultiply(')) boundaryChecks += `
    check(checkedMultiply(numeric_limits<long long>::min(),0)==0);
    check(checkedMultiply(numeric_limits<long long>::min(),1)==numeric_limits<long long>::min());
    check(checkedMultiply(-3,-4)==12);
    for (auto operands:vector<pair<long long,long long>>{{numeric_limits<long long>::min(),-1},{-1,numeric_limits<long long>::min()},{numeric_limits<long long>::max(),2}}) {
      bool threw=false; try { checkedMultiply(operands.first,operands.second); } catch(const overflow_error&) {threw=true;} check(threw);
    }`;
  return `namespace sample_${i} {\n${code}\nvoid run() {\n${unit.checks}\n${boundaryChecks}\n}\n}`;
});
const source = [...headers].join('\n') + '\nvoid check(bool value) { if (!value) throw std::runtime_error("check failed"); }\n' +
  definitions.join('\n') + '\nint main() {\n' + units.map((unit, i) =>
    `try { sample_${i}::run(); } catch(const std::exception& e) { std::cerr << ${JSON.stringify(unit.name + ': ')} << e.what() << "\\n"; return 1; }`).join('\n') +
  '\nstd::cout << "Passed C++ checks for 103 reference snippets.\\n";\n}\n';
if (process.argv[2] === '--validate') {
  console.log('Validated C++ test coverage for 100 algorithms / 103 unique snippets. No compiler was run.');
  process.exit(0);
}
const compiler = process.argv[2] || 'g++';
const msvc = /^cl(?:\.exe)?$/i.test(path.basename(compiler));
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'alg0vault-cpp-'));
const input = path.join(directory, 'references.cpp');
const output = path.join(directory, process.platform === 'win32' ? 'references.exe' : 'references');
fs.writeFileSync(input, source);
const args = msvc ? ['/nologo', '/std:c++17', '/EHsc', '/W4', input, '/Fe:' + output, '/Fo:' + path.join(directory, 'references.obj')] :
  ['-std=c++17', '-O0', '-Wall', '-Wextra', '-pedantic', input, '-o', output];
const built = spawnSync(compiler, args, { cwd: directory, encoding: 'utf8', timeout: 180000, maxBuffer: 8*1024*1024 });
if (built.error || built.status !== 0) {
  console.error(built.error?.message || built.stderr || built.stdout);
  console.error('Generated source retained for inspection: ' + input);
  process.exit(1);
}
process.stderr.write(built.stderr || '');
const ran = spawnSync(output, [], { cwd: directory, encoding: 'utf8', timeout: 30000 });
process.stdout.write(ran.stdout || ''); process.stderr.write(ran.stderr || '');
if (ran.error) console.error(ran.error.message);
// Only remove known generated files from the directory created above; never recurse.
for (const file of [input, output, path.join(directory, 'references.obj')])
  if (fs.existsSync(file)) fs.unlinkSync(file);
if (fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
process.exit(ran.status ?? 1);
