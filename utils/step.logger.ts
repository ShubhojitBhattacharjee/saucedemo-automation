// utils/stepLogger.ts
import { allure } from 'allure-playwright';

export class StepLogger {
  private currentId = 1;

  /** Manually set the next step ID */
  stepId(id: number) {
    this.currentId = id;
  }

  /**
   * Log a step to console AND record it in Allure.
   * @param message the human-readable step description
   */
  async step(message: string): Promise<void> {
    const stepLabel = `STEP ${this.currentId}: ${message}`;

    // 1) Console log
    console.log(stepLabel);

    // 2) Allure log
    await allure.step(stepLabel, async () => {
      // no-op inside: we already executed the real work around this call
    });

    // increment for next step
    this.currentId++;
  }
}

export const stepLogger = new StepLogger();
