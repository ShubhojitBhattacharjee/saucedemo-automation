// utils/retryHelper.ts
export async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < retries; i++) {
      try { return await fn(); }
      catch (e) { lastError = e; await new Promise(r => setTimeout(r, delayMs)); }
    }
    throw lastError;
  }
  