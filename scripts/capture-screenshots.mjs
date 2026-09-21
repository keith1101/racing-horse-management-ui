import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseUrl = 'http://172.23.224.1:8443/';
const outputDir = fileURLToPath(new URL('../artifacts/screenshots/', import.meta.url));
const accounts = [
  ['trainer', 'elena.cardoso@riversidertms.com', ['Overview', 'Horses', 'Training', 'Racing', 'Admissions']],
  ['veterinarian', 'amelia.haines@riversidertms.com', ['Overview', 'Horses', 'Veterinary', 'Admissions']],
  ['groom', 'damilola.okafor@riversidertms.com', ['Overview', 'Horses', 'Stable health', 'Stable care', 'Admissions']],
  ['owner', 'owner@marloweracing.com', ['Overview', 'My horses', 'Training', 'Racing', 'My account']],
  ['manager', 'sofia.bennett@riversidertms.com', ['Overview', 'Horses', 'Racing', 'Management']],
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function settle(page) {
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete), undefined, { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(750);
}
const loginPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await loginPage.goto(baseUrl, { waitUntil: 'networkidle' });
await loginPage.screenshot({ path: `${outputDir}/login.png`, fullPage: true });
await loginPage.close();
for (const [role, email, screens] of accounts) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password').fill('rtms2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForLoadState('networkidle');
  for (const screen of screens) {
    await page.getByRole('button', { name: screen, exact: true }).click();
    await settle(page);
    await page.screenshot({ path: `${outputDir}/${role}-${screen.toLowerCase().replaceAll(' ', '-')}.png`, fullPage: true });
    if (screen.toLowerCase().includes('horses')) {
      const horse = page.getByRole('button', { name: /profile/i }).first();
      if (await horse.isVisible().catch(() => false)) {
        await horse.click();
        await settle(page);
        await page.screenshot({ path: `${outputDir}/${role}-horse-profile.png`, fullPage: true });
      }
    }
    if (role === 'veterinarian' && screen === 'Veterinary') {
      await page.getByRole('button', { name: 'Record examination' }).click();
      await page.locator('svg[aria-label="Interactive 3D horse injury viewer"]').waitFor({ state: 'visible', timeout: 10_000 });
      await settle(page);
      await page.screenshot({ path: `${outputDir}/veterinarian-examination-3d.png`, fullPage: true });
    }
  }
  await page.close();
}
await browser.close();
