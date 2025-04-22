import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  snapshotDir: './visual',
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
