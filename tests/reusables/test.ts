import { Page } from 'playwright';
import { createConfigAndCleanup } from './createConfigAndCleanup';
import { runHeadless } from '../../packages/manager/src/server/modes/runHeadless';
import { expect, test as _test } from '@playwright/test';
import { PreviewBuilder } from './preview';
import { withStatefulHandlers } from './state';
import type { Application } from 'express-serve-static-core';

type Config = {
  preview: PreviewBuilder;
  test(page: Page): Promise<void>;
};

export function test(message: string, { test, preview }: Config) {
  _test(message, async ({ page }) => {
    _test.setTimeout(120_000);

    const { app, cleanup } = await runHeadless(createConfigAndCleanup(preview));

    const getJournal = withClientActJournal(app);

    withStatefulHandlers(app);

    await page.goto('http://localhost:6006/?manager=SECRET');

    await test(page);

    expect(getJournal()).toMatchSnapshot(`${message}.txt`);

    cleanup();
  });
}

function withClientActJournal(app: Application) {
  const calls: unknown[] = [];

  app.post('/api/client/act', async (request, response) => {
    calls.push(request.body);

    response.json({
      type: 'success',
      data: undefined,
    });
  });

  return () => JSON.stringify(calls, null, 2).replace(/\n/g, '\r\n');
}
