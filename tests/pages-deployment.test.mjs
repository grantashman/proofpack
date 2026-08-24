import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const astroConfig = new URL('../astro.config.mjs', import.meta.url);
const landingPage = new URL('../src/pages/index.astro', import.meta.url);
const sampleReport = new URL('../src/pages/sample-report.astro', import.meta.url);
const workflow = new URL('../.github/workflows/pages.yml', import.meta.url);

async function read(path) {
  return readFile(path, 'utf8');
}

test('GitHub Pages build uses the ProofPack project-site base only for Pages', async () => {
  const config = await read(astroConfig);
  assert.match(config, /process\.env\.GITHUB_PAGES/);
  assert.match(config, /https:\/\/grantashman\.github\.io/);
  assert.match(config, /\/proofpack/);
});

test('public routes and assets derive from Astro BASE_URL', async () => {
  const [landing, report] = await Promise.all([read(landingPage), read(sampleReport)]);
  assert.match(landing, /import\.meta\.env\.BASE_URL/);
  assert.match(report, /import\.meta\.env\.BASE_URL/);
  assert.doesNotMatch(landing, /href="\/(?:sample-report|assets|brand)\//);
  assert.doesNotMatch(report, /href="\/(?:sample-report|assets|brand)\//);
});

test('Pages workflow builds and deploys dist with least-privilege permissions', async () => {
  const source = await read(workflow);
  assert.match(source, /pages:\s*write/);
  assert.match(source, /id-token:\s*write/);
  assert.match(source, /GITHUB_PAGES:\s*1/);
  assert.match(source, /actions\/configure-pages@v6/);
  assert.match(source, /actions\/upload-pages-artifact@v5/);
  assert.match(source, /actions\/deploy-pages@v5/);
  assert.match(source, /path:\s*\.\/dist/);
});
