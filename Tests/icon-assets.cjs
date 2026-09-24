const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file));
const pngSignature = Buffer.from([137,80,78,71,13,10,26,10]);

test('robot icon has all nine Windows sizes and valid embedded PNG dimensions', () => {
  const icon = read('Assets/alg0vault.ico');
  assert.equal(icon.readUInt16LE(0),0);
  assert.equal(icon.readUInt16LE(2),1);
  const sizes = [16,20,24,32,40,48,64,128,256];
  assert.equal(icon.readUInt16LE(4),sizes.length);
  let nextOffset = 6+16*sizes.length;
  sizes.forEach((size,i) => {
    const entry = 6+16*i;
    assert.equal(icon[entry] || 256,size);
    assert.equal(icon[entry+1] || 256,size);
    assert.equal(icon.readUInt16LE(entry+6),32);
    const length = icon.readUInt32LE(entry+8), offset = icon.readUInt32LE(entry+12);
    assert.equal(offset,nextOffset);
    const png = icon.subarray(offset,offset+length);
    assert.ok(png.subarray(0,8).equals(pngSignature));
    assert.equal(png.readUInt32BE(16),size);
    assert.equal(png.readUInt32BE(20),size);
    assert.equal(png.length,length);
    nextOffset += length;
  });
  assert.equal(nextOffset,icon.length);
  const large = read('Assets/alg0vault-icon.png');
  assert.ok(large.subarray(0,8).equals(pngSignature));
  assert.equal(large.readUInt32BE(16),512);
  assert.equal(large.readUInt32BE(20),512);
});

test('browser and native branding reference the robot assets', () => {
  const svg = read('Assets/alg0vault-robot.svg').toString();
  assert.match(svg, /aria-label="Robot"/);
  assert.doesNotMatch(svg, /<script|<image|href=|<foreignObject/i);
  const html = read('WebApp/index.html').toString();
  assert.match(html, /rel="icon"[^>]+alg0vault-robot\.svg/);
  assert.match(html, /class="brand"><img src="\.\.\/Assets\/alg0vault-robot\.svg"/);
  assert.match(read('AlgorithmVault.csproj').toString(), /<ApplicationIcon>Assets\\alg0vault\.ico<\/ApplicationIcon>/);
  const native = read('MainWindow.xaml').toString();
  assert.match(native, /Icon="Assets\/alg0vault\.ico"/);
  assert.match(native, /<Image Source="Assets\/alg0vault\.ico"/);
});
