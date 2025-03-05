import { test as _test } from '@playwright/test';
import { Page } from 'playwright';
import { cleanups, CreateTempPath, setup, teardown } from './env';

export function describe(title: string, tests: () => unknown) {
  _test.describe(title, tests);
}

export function test(title: string, actor: { __arrangers(): Arrangers }) {
  _test(title, async ({ page }) => {
    try {
      const createTempPath = setup();
      const tests = actor.__arrangers();

      for (const arrange of tests) {
        const { cleanup, act } = await arrange(createTempPath);

        cleanups.push(cleanup);

        await act(page);
      }
    } finally {
      await teardown();
    }
  });
}

_test.afterEach(teardown);

type Act = {
  act: Action;
  cleanup(): Promise<void>;
};

type Arrange = (createTempPath: CreateTempPath) => Promise<Act>;

export type Arrangers = Arrange[];

export type Action = (page: Page) => Promise<unknown>;
