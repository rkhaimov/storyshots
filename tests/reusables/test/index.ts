import { test as _test } from '@playwright/test';
import { TestDescription } from './description';
import { cleanups, setup, teardown } from './env';

export function describe(title: string, tests: () => unknown) {
  _test.describe(title, tests);
}

export function test(title: string, { __description }: TestDescription) {
  _test(title, async ({ page }) => {
    try {
      const createTP = await setup();
      const description = __description();

      await description.onSetup?.(createTP, page);

      const meta = await description.onRun?.(createTP, page);

      cleanups.push(meta.cleanup);

      await meta.run();

      for (const arrange of description.actions) {
        const { cleanup, run } = await arrange(createTP, page);

        cleanups.push(cleanup);

        await run();
      }
    } finally {
      await teardown();
    }
  });
}

_test.afterEach(teardown);
