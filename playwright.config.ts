import { defineConfig } from '@playwright/test';
import { appConfig } from './config/app.config';

export default defineConfig({
  testDir: './tests/specs',
  snapshotDir: './visual',
  use: {
    baseURL: appConfig.baseURL,
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['allure-playwright']]
});
