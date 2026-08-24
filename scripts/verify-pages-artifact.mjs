import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const landing = await readFile(new URL('index.html', root), 'utf8');
const report = await readFile(new URL('sample-report/index.html', root), 'utf8');

for (const path of [
  'assets/wrapsheet-sample-report.pdf',
  'brand/wrapsheet-mark.svg',
  'brand/wrapsheet-icon-180.png',
  'brand/wrapsheet-og.png',
]) {
  await access(new URL(path, root));
}

assert.match(landing, /The job's wrapped\./);
assert.match(landing, /href="\/wrapsheet\/sample-report\/"/);
assert.match(landing, /href="\/wrapsheet\/assets\/wrapsheet-sample-report\.pdf"/);
assert.match(landing, /href="\/wrapsheet\/brand\/wrapsheet-mark\.svg"/);
assert.match(landing, /https:\/\/grantashman\.github\.io\/wrapsheet\//);
assert.doesNotMatch(landing, /href="\/(?:sample-report|assets|brand)\//);

assert.match(report, /Fictional example · for product demonstration/);
assert.match(report, /href="\/wrapsheet\/"/);
assert.match(report, /href="\/wrapsheet\/assets\/wrapsheet-sample-report\.pdf"/);
assert.doesNotMatch(report, /href="\/(?:sample-report|assets|brand)\//);

console.log('GitHub Pages artifact routes and assets verified.');
