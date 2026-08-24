import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflowPath = new URL('../.github/workflows/ci.yml', import.meta.url);

test('GitHub Actions use current Node 24 action runtimes', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v4/);
});
