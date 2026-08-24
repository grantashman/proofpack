import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pagePath = new URL('../src/pages/index.astro', import.meta.url);
const stylePath = new URL('../src/styles/page.css', import.meta.url);

async function read(path) {
  return readFile(path, 'utf8');
}

test('landing page names the cleaner audience and drives one pilot action', async () => {
  const source = await read(pagePath);
  assert.match(source, /Leave every clean with proof\./);
  assert.match(source, /Australian commercial cleaners/);
  assert.match(source, /Apply for the pilot/);
  assert.match(source, /id="pilot"/);
});

test('pricing and product proof are explicit without invented social proof', async () => {
  const source = await read(pagePath);
  assert.match(source, /id="pricing"/);
  assert.match(source, /formatPilotPrice/);
  assert.match(source, /GST included/);
  assert.match(source, /View the sample report/);
  assert.match(source, /Illustrated demo photo slot/);
  assert.doesNotMatch(source, /Trusted by|<blockquote|testimonial/i);
});

test('pilot form and page metadata have accessible, production-shaped contracts', async () => {
  const source = await read(pagePath);
  assert.match(source, /<label[^>]+for="business-name"/);
  assert.match(source, /<label[^>]+for="email"/);
  assert.match(source, /aria-describedby="pilot-status"/);
  assert.match(source, /method="post"/);
  assert.match(source, /data-submit aria-describedby="pilot-status" disabled/);
  assert.match(source, /application\/ld\+json/);
  assert.match(source, /property="og:image"/);
  assert.match(source, /<details/);
});

test('design system uses locked tokens and mobile overflow protection', async () => {
  const styles = await read(stylePath);
  assert.match(styles, /Hallmark · genre: modern-minimal · macrostructure: Workbench/);
  assert.match(styles, /@import ['"]\.\.\/\.\.\/tokens\.css['"]/);
  assert.match(styles, /html[\s\S]*overflow-x:\s*clip/);
  assert.match(styles, /body[\s\S]*overflow-x:\s*clip/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /transition:\s*all/i);
});
