import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 375, 414, 768];

for (const width of widths) {
  test(`landing page stays usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: "The job's wrapped. The proof's attached." })).toBeVisible();
    await expect(page.getByText('$39', { exact: true })).toBeVisible();
    await expect(page.getByText('AUD / month', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Apply for the pilot' }).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    const wrappedAffordances = await page.locator('a, button, summary').evaluateAll((nodes) => nodes
      .filter((node) => {
        const rects = node.getClientRects();
        const style = getComputedStyle(node);
        return rects.length > 0 && style.visibility !== 'hidden' && node.scrollHeight > node.clientHeight + 2;
      })
      .map((node) => node.textContent?.trim()));
    expect(wrappedAffordances).toEqual([]);
  });
}

test('hero content and proof fit a 1280 by 800 laptop fold', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const cta = await page.getByRole('link', { name: 'Apply for the pilot' }).nth(1).boundingBox();
  const proof = await page.locator('.report-preview--hero').boundingBox();
  expect(cta).not.toBeNull();
  expect(proof).not.toBeNull();
  expect(cta.y + cta.height).toBeLessThanOrEqual(800);
  expect(proof.y + proof.height).toBeLessThanOrEqual(800);
});

test('pilot application fails closed when JavaScript is unavailable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('[data-pilot-form]')).toHaveAttribute('method', 'post');
  await expect(page.locator('[data-submit]')).toBeDisabled();
  await expect(page.getByText('JavaScript is required to apply')).toBeVisible();

  await context.close();
});

test('page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(blocking).toEqual([]);
});

test('pilot form explains invalid and unconnected states', async ({ page }) => {
  await page.goto('/#pilot');
  const submit = page.locator('[data-submit]');
  await submit.click();
  await expect(page.locator('#business-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#pilot-status')).toContainText('details need attention');

  await page.locator('#business-name').fill('Bright Office Cleaning');
  await page.locator('#email').fill('hello@brightoffice.example');
  await submit.click();
  await expect(page.locator('#pilot-status')).toContainText('pilot inbox is not connected');
});

test('sample report is explicit fiction and print-shaped', async ({ page }) => {
  await page.goto('/sample-report/');
  await expect(page.getByText('Fictional example · for product demonstration')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Harbour Street Offices' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/assets/wrapsheet-sample-report.pdf');
});
