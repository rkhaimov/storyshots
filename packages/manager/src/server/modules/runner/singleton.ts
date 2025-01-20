import { assert } from '@storyshots/core';
import { chromium } from 'playwright';
import { createContextByDevice } from './createContextByDevice';

import { Runner } from './types';

export function singleton(): Runner {
  return {
    agentsCount: 1,
    run: async () => {
      const browser = await chromium.launch();

      let busy = false;
      return {
        busy: () => busy,
        allocate: async (story, task) => {
          assert(!busy, 'Runner is busy');
          busy = true;

          const context = await createContextByDevice(story, browser);
          context.setDefaultTimeout(10_000);
          const result = await task(await context.newPage());
          await context.close();

          busy = false;
          return result;
        },
        close: () => browser.close(),
      };
    },
  };
}
