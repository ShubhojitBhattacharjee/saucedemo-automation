# SauceDemo Playwright Automation Framework

A layered Playwright test suite for [SauceDemo](https://www.saucedemo.com/) demonstrating:

- **Test Runner Layer** (business-friendly steps + assertions)
- **Page Classes Layer** (high-level “services” with private locators)
- **Automation Tool Layer** (`PlaywrightActions` with raw Playwright API calls)
- **Utility Layer** (`stepLogger`, retry helpers, etc.)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Configuration](#configuration)  
4. [Project Structure](#project-structure)  
5. [Running Tests](#running-tests)  
6. [Reports & Artifacts](#reports--artifacts)  
7. [Utilities](#utilities)  

---

## ✅ Prerequisites

- Node.js ≥16.x  
- npm or yarn  
- [Allure Commandline](https://docs.qameta.io/allure/) for generating HTML reports  

---

## Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/ShubhojitBhattacharjee/saucedemo-automation.git
   cd saucedemo-automation
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Playwright browsers**  
   ```bash
   npx playwright install
   ```

4. **Install Allure CLI**  
   ```bash
   npm install --save-dev allure-commandline
   ```

---

## ⚙️ Configuration

### 1. App Config

```ts
// config/app.config.ts
export const appConfig = {
  baseURL: process.env.APP_URL!,
  credentials: {
    user: process.env.STANDARD_USER!,
    pass: process.env.STANDARD_PASS!,
  },
};
```

### 2. Playwright Config

```ts
// playwright.config.ts
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
```

---

## 📂 Project Structure

```
├── core/                    # Automation Tool Layer
│   └── playwrightActions.ts
├── pages/                   # Page Classes Layer
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── inventory.page.ts
│   └── checkout.page.ts
├── utils/                   # Utility Layer
│   ├── step.logger.ts
│   └── retry.helper.ts
│   └── auto.heaing.ts
├── config/                  # App configuration
│   └── app.config.ts
├── tests/                   # Test Runner Layer
│   └── specs/
│       ├── saucedemo.spec.ts
│       ├── auth-cart-checkout.spec.ts
│       ├── checkout-validation.spec.ts
│       ├── visual.spec.ts
│       └── accessibility.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## ▶️ Running Tests

- **All tests**  
  ```bash
  npm test
  # or
  npx playwright test
  ```

- **Single spec**  
  ```bash
  npx playwright test tests/specs/checkout-validation.spec.ts
  ```

- **Headed**  
  ```bash
  npx playwright test --headed
  ```

- **Debug (slow-mo)**  
  ```bash
  npx playwright test --slow-mo=500
  ```

---

## Reports & Artifacts

- **HTML report**  
  ```bash
  npx playwright show-report
  ```

- **Allure report**  
  ```bash
  npm run report:generate
  npm run report:open
  ```

- **Artifacts** (screenshots, videos, traces) in `test-results/`

---

## Utilities

- **\`stepLogger\`**  
  ```ts
  stepLogger.stepId(1);
  await stepLogger.step('Business step description');
  ```

- **\`autoHealClick\`**  
  ```ts
  autoHealClick(actions, locators)
  ```

- **\`retryHelper\`**  
  ```ts
  await retry(() => flakyOperation(), 3, 500);
  ```

---


