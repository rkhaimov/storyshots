import { Browser, chromium } from 'playwright';
import { Story } from '../../../reusables/types';

import { Worker } from './types';

export async function createIsolatedContextWorker(): Promise<Worker> {
  const browser = await chromium.launch();

  return {
    allocate: async (story) => {
      const context = await createContextByDevice(story, browser);

      context.setDefaultTimeout(10_000);

      const page = await context.newPage();

      return { page, cleanup: () => context.close() };
    },
    destroy: () => browser.close(),
  };
}

async function createContextByDevice(
  { payload: { device } }: Story,
  browser: Browser,
) {
  return browser.newContext({
    viewport: { width: device.width, height: device.height },
    userAgent: device.userAgent,
  });
}
