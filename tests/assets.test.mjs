import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const root = new URL('../public/', import.meta.url);

async function bytes(path) {
  return readFile(new URL(path, root));
}

test('brand SVG assets are accessible and self-describing', async () => {
  const mark = (await bytes('brand/proofpack-mark.svg')).toString('utf8');
  const lockup = (await bytes('brand/proofpack-lockup.svg')).toString('utf8');
  assert.match(mark, /<title/);
  assert.match(mark, /<desc/);
  assert.match(lockup, /ProofPack/);
});

test('raster launch assets have valid signatures, dimensions and useful file sizes', async () => {
  const expected = new Map([
    ['brand/proofpack-icon-180.png', [180, 180]],
    ['brand/proofpack-icon-512.png', [512, 512]],
    ['brand/proofpack-og.png', [1200, 630]],
  ]);

  for (const [asset, [width, height]] of expected) {
    const data = await bytes(asset);
    assert.equal(data.subarray(1, 4).toString('ascii'), 'PNG', `${asset} must be a PNG`);
    assert.equal(data.readUInt32BE(16), width, `${asset} has the wrong width`);
    assert.equal(data.readUInt32BE(20), height, `${asset} has the wrong height`);
    assert.ok(data.length > 500, `${asset} is unexpectedly small`);
    assert.ok(data.length < 1_500_000, `${asset} exceeds the landing-page asset budget`);
  }
});

test('downloadable sample report is a bounded, multi-page PDF without false pagination', async () => {
  const report = await bytes('assets/proofpack-sample-report.pdf');
  assert.equal(report.subarray(0, 4).toString('ascii'), '%PDF');
  const info = await stat(new URL('assets/proofpack-sample-report.pdf', root));
  assert.ok(info.size > 10_000);
  assert.ok(info.size < 1_500_000);
  const pageObjects = [...report.toString('binary').matchAll(/\/Type\s*\/Page\b/g)].length;
  assert.ok(pageObjects >= 2 && pageObjects <= 3, `expected a 2–3 page A4 report, got ${pageObjects}`);

  const reportSource = await readFile(new URL('../src/pages/sample-report.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(reportSource, /page 1 of 1/i);
});
