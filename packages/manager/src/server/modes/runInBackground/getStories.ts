import { assertNotEmpty, PureStoryTree } from '@storyshots/core';
import { chromium } from 'playwright';
import { createManagerRootURL } from '../../paths';
import { ManagerConfig } from '../../types';

export async function getStories(
  config: ManagerConfig,
): Promise<PureStoryTree[]> {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.goto(createManagerRootURL(config).href, { timeout: 0 });

  const handle = await page.waitForFunction(() => window.getStories(), {
    timeout: 0,
  });

  const state = await handle.jsonValue();

  assertNotEmpty(state);

  await browser.close();

  return state;
}
