import { assertNotEmpty } from '@storyshots/core';
import { chromium } from 'playwright';
import { CIChannel, RunnableStoriesSuit } from '../../../reusables/types';
import { createManagerRootURL } from '../../paths';
import { ManagerConfig } from '../../types';

export async function getStories(
  config: ManagerConfig,
): Promise<RunnableStoriesSuit[]> {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.goto(createManagerRootURL(config).href, { timeout: 0 });

  const handle = await page.waitForFunction(
    () => (window as unknown as CIChannel).evaluate(),
    { timeout: 0 },
  );

  const state = await handle.jsonValue();

  assertNotEmpty(state);

  await browser.close();

  return state;
}
