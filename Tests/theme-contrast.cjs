// Static palette calculations, not a claim of complete visual/accessibility testing.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../WebApp/themes.css'), 'utf8');
const names = ['ocean','emerald','rose','amber','crimson','slate','sky','paper'];
function luminance(hex) {
  const rgb = hex.replace('#','').match(/../g).map(x => parseInt(x,16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
function contrast(a,b) { const x = luminance(a), y = luminance(b); return (Math.max(x,y) + .05) / (Math.min(x,y) + .05); }
for (const name of names) test(name + ' palette has complete tokens and readable core text/control pairs', () => {
  const block = new RegExp('body\\[data-theme=' + name + '\\]\\s*\\{([^}]+)\\}').exec(css)?.[1];
  assert.ok(block, name);
  const tokens = Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[a-f0-9]{6})\b/gi)].map(m => [m[1],m[2]]));
  for (const key of ['app','top','side','library','detail','field','card','hover','selection','border','text','muted','section','accent','soft','mint','danger','button-bg','button-hover','button-text']) assert.ok(tokens[key], name + ':' + key);
  for (const foreground of ['text','muted','section','accent','mint']) {
    for (const background of ['app','top','side','library','detail','field','card','selection']) {
      const ratio = contrast(tokens[foreground],tokens[background]);
      assert.ok(ratio >= 4.5, `${name} ${foreground}/${background}: ${ratio.toFixed(2)} < 4.5`);
    }
  }
  for (const background of ['button-bg','button-hover']) assert.ok(contrast(tokens['button-text'],tokens[background]) >= 4.5, name + ' button');
});

const codeCss = fs.readFileSync(path.join(__dirname, '../WebApp/code-themes.css'), 'utf8');
const codeThemes = ['current','dark','purple','white',...names];
for (const name of codeThemes) test(name + ' code palette has readable syntax, selection, and table headers', () => {
  const block = new RegExp('body\\[data-theme=' + name + '\\]\\s*\\{([^}]+)\\}').exec(codeCss)?.[1];
  assert.ok(block, name);
  const tokens = Object.fromEntries([...block.matchAll(/--(code-[a-z-]+):\s*(#[a-f0-9]{6})\b/gi)].map(m => [m[1],m[2]]));
  for (const key of ['bg','text','keyword','string','comment','number','border','selection']) assert.ok(tokens['code-'+key],name+':'+key);
  for (const foreground of ['text','keyword','string','comment','number']) {
    const ratio = contrast(tokens['code-'+foreground],tokens['code-bg']);
    assert.ok(ratio >= 4.5, `${name} code ${foreground}: ${ratio.toFixed(2)} < 4.5`);
  }
  assert.ok(contrast(tokens['code-text'],tokens['code-selection']) >= 4.5,name+' selection/header');
  assert.ok(contrast(tokens['code-text'],tokens['code-bg']) >= 7,name+' plain code text');
  const isLight = ['white','sky','paper'].includes(name);
  assert.equal(luminance(tokens['code-bg']) > .5,isLight,name+' background brightness');
});

test('all code surfaces and lesson tables use the shared palette after legacy CSS', () => {
  const index = fs.readFileSync(path.join(__dirname,'../WebApp/index.html'),'utf8');
  assert.ok(index.indexOf('code-themes.css') > index.indexOf('polish.css'));
  assert.match(codeCss, /body\[data-theme\] :is\(\.codebox, \.code-input, \.learning-markdown pre\)/);
  for (const [kind,token] of [['kw','keyword'],['str','string'],['com','comment'],['num','number']])
    assert.ok(codeCss.includes('.'+kind+' { color: var(--code-'+token+'); }'));
  assert.match(codeCss, /::selection\s*\{\s*background: var\(--code-selection\);\s*color: var\(--code-text\)/);
  assert.match(codeCss, /\.learning-markdown table\s*\{\s*background: var\(--code-bg\)/);
});
