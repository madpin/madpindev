import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/about/',
  '/2026/05/02-epublate-translating-books-with-llms/',
  '/pt-br/2025/12/06-o-grande-sequestro-ecologico/',
  '/search/',
  '/adhd-assessment/',
  '/pages/acls-notes/'
];

for (const path of pages) {
  test(`${path} has no automated accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('navigation is keyboard and mobile operable', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const toggle = page.getByRole('button', { name: 'Menu' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('light and dark backgrounds toggle and persist', async ({ page }) => {
  await page.goto('/');
  const themeToggle = page.locator('[data-theme-toggle]');
  if (await themeToggle.isHidden()) await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(0, 0, 0)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const persistedToggle = page.locator('[data-theme-toggle]');
  if (await persistedToggle.isHidden()) await page.getByRole('button', { name: 'Menu' }).click();
  await persistedToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)');
});

for (const path of ['/', '/2026/05/02-epublate-translating-books-with-llms/', '/adhd-assessment/', '/pages/acls-notes/']) {
  test(`${path} dark background has no automated accessibility violations`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('madpindev-theme', 'dark'));
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('footer social links use accessible local icons', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  for (const name of ['GitHub', 'GitLab', 'LinkedIn', 'Stack Overflow', 'Instagram', 'RSS']) {
    const link = footer.getByRole('link', { name });
    await expect(link).toBeVisible();
    await expect(link.locator('svg')).toHaveCount(1);
  }
});

test('production pages do not contact third-party origins', async ({ page }) => {
  const externalOrigins = new Set();
  page.on('request', request => {
    const origin = new URL(request.url()).origin;
    if (origin !== 'http://127.0.0.1:1414') externalOrigins.add(origin);
  });
  await page.goto('/2026/05/02-epublate-translating-books-with-llms/');
  await page.waitForLoadState('networkidle');
  expect([...externalOrigins]).toEqual([]);
});

test('Pagefind returns a valid article result', async ({ page }) => {
  await page.goto('/search/');
  await page.getByRole('searchbox', { name: 'Search articles' }).fill('Python');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByRole('status')).toContainText(/result/i);
  await expect(page.locator('.search-result a').first()).toHaveAttribute('href', /python/i);
});

test('Pagefind uses the Portuguese language index', async ({ page }) => {
  await page.goto('/pt-br/search/');
  await page.getByRole('searchbox', { name: 'Buscar artigos' }).fill('ecologia');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('status')).toContainText(/resultado/i);
  await expect(page.locator('.search-result a').first()).toHaveAttribute('href', /\/pt-br\//);
});

test('translated posts expose reciprocal language links', async ({ page }) => {
  await page.goto('/2024/12/15-frying-pan-brazilian-cheese-bread/');
  await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute('href', /\/pt-br\//);
  const portugueseLink = page.getByRole('link', { name: 'Português' });
  if (await portugueseLink.isHidden()) await page.getByRole('button', { name: 'Menu' }).click();
  await portugueseLink.click();
  await expect(page).toHaveURL(/\/pt-br\//);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('post heroes use processed responsive images', async ({ page }) => {
  await page.goto('/2026/05/02-epublate-translating-books-with-llms/');
  const hero = page.locator('.hero-media img');
  await expect(hero).toHaveAttribute('srcset', /webp/);
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
});

test('ADHD demo exposes touch controls and true paused state', async ({ page }) => {
  await page.goto('/adhd-assessment/');
  await page.getByRole('button', { name: 'Start task' }).click();
  const pause = page.getByRole('button', { name: 'Pause' });
  await expect(pause).toBeVisible();
  await pause.click();
  await expect(page.locator('[data-adhd-tool]')).toHaveAttribute('data-state', 'paused');
  await expect(page.locator('[data-action="response"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /Stop/ })).toBeVisible();
});

test('ACLS search and local notes controls are operable', async ({ page }) => {
  await page.goto('/pages/acls-notes/');
  await page.getByRole('searchbox', { name: 'Search study notes' }).fill('epinephrine');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('status').first()).not.toBeEmpty();
  await page.getByRole('button', { name: 'Personal notes' }).click();
  await expect(page.getByRole('dialog', { name: 'Personal study notes' })).toBeVisible();
});
