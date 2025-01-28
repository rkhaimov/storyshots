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
  {
    payload: {
      config: { device },
    },
  }: Story,
  browser: Browser,
) {
  switch (device.type) {
    case 'size-only':
      return browser.newContext({ viewport: device.config });
    case 'emulated':
      return browser.newContext({
        viewport: device.config,
        userAgent: device.config.userAgent,
      });
  }
}
