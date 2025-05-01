// utils/autoHealing.ts
import { PlaywrightActions } from '../core/playwright.actions';

/**
 * Try clicking each locator in sequence until one succeeds.
 * Logs a warning for each failure.
 */
export async function autoHealClick(
  actions: PlaywrightActions,
  locators: string[]
): Promise<void> {
  let lastError: unknown;
  for (const selector of locators) {
    try {
      await actions.click(selector);
      console.log(`autoHealClick: succeeded with "${selector}"`);
      return;
    } catch (err) {
      console.warn(`autoHealClick: "${selector}" failed, trying next…`, err);
      lastError = err;
    }
  }
  // if we get here, none worked
  throw lastError;
}
