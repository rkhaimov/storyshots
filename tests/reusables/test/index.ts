import { isNil } from '@lib';
import { test as _test } from '@playwright/test';
import { ManagerMeta, TestDescription } from './test-description';
import { createTempFolder } from './temp-folder';

export function describe(title: string, tests: () => unknown) {
  _test.describe(title, tests);
}

export function test(title: string, { __description }: TestDescription) {
  const cleanups: ManagerMeta['cleanup'][] = [];

  _test(title, async ({ page }) => {
    const tf = createTempFolder();
    const steps = __description();

    for (const step of steps) {
      await clean();

      await step.preview(page, tf);

      const { run, cleanup } = await step.manager(page, tf);

      cleanups.push(cleanup);

      await run();

      for (const action of step.actions) {
        await action(page, tf);
      }
    }
  });

  _test.afterEach(clean);

  async function clean() {
    while (true) {
      const clean = cleanups.shift();

      if (isNil(clean)) {
        break;
      }

      await clean();
    }
  }
}
