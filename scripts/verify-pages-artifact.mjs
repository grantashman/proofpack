import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const landing = await readFile(new URL('index.html', root), 'utf8');
const report = await readFile(new URL('sample-report/index.html', root), 'utf8');

for (const path of [
  'assets/proofpack-sample-report.pdf',
  'brand/proofpack-mark.svg',
  'brand/proofpack-icon-180.png',
  'brand/proofpack-og.png',
]) {
  await access(new URL(path, root));
}

assert.match(landing, /Leave every clean with proof\./);
assert.match(landing, /href="\/proofpack\/sample-report\/"/);
assert.match(landing, /href="\/proofpack\/assets\/proofpack-sample-report\.pdf"/);
assert.match(landing, /href="\/proofpack\/brand\/proofpack-mark\.svg"/);
assert.match(landing, /https:\/\/grantashman\.github\.io\/proofpack\//);
assert.doesNotMatch(landing, /href="\/(?:sample-report|assets|brand)\//);

assert.match(report, /Fictional example · for product demonstration/);
assert.match(report, /href="\/proofpack\/"/);
assert.match(report, /href="\/proofpack\/assets\/proofpack-sample-report\.pdf"/);
assert.doesNotMatch(report, /href="\/(?:sample-report|assets|brand)\//);

console.log('GitHub Pages artifact routes and assets verified.');
