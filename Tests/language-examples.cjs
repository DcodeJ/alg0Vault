// Usage: node Tests/language-examples.cjs [path-to-python]
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../WebApp/language-samples.js'), 'utf8'), context);
context.window.ALG0_LANGUAGE_SAMPLES.catalogCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-language-cases.json'), 'utf8'));
const result = spawnSync(process.argv[2] || 'python', ['-B', path.join(__dirname, 'check-language-examples.py')], {
  input: JSON.stringify(context.window.ALG0_LANGUAGE_SAMPLES), encoding: 'utf8',
  env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' }
});
if (result.error) { console.error(result.error.message); process.exit(1); }
process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || '');
process.exit(result.status ?? 1);
