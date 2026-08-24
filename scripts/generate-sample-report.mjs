import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const origin = 'http://127.0.0.1:4322';
const output = fileURLToPath(new URL('../public/assets/proofpack-sample-report.pdf', import.meta.url));
await mkdir(fileURLToPath(new URL('../public/assets/', import.meta.url)), { recursive: true });

const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4322'], {
  stdio: 'ignore',
  detached: true,
});

const waitForServer = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${origin}/sample-report/`);
      if (response.ok) return;
    } catch {
      // Preview has not opened its socket yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out waiting for the Astro preview server.');
};

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${origin}/sample-report/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });
  console.log(`Generated ${output}`);
} finally {
  await browser?.close();
  if (preview.pid) process.kill(-preview.pid, 'SIGTERM');
}
