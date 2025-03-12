import { assertNotEmpty, Device, PureStoryTree } from '@storyshots/core';
import { chromium } from 'playwright';
import { createManagerRootURL } from '../../paths';
import { ManagerConfig } from '../../types';

export async function getStories(
  config: ManagerConfig,
): Promise<PureStoryTree[]> {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.goto(createManagerRootURL(config).href, { timeout: 0 });

  const handle = await page.waitForFunction(() => window.getStories(), null, {
    timeout: 0,
  });

  const state = await handle.jsonValue();

  assertNotEmpty(state);

  await browser.close();

  return withConfiguredDevices(config, state);
}

function withConfiguredDevices(
  config: ManagerConfig,
  stories: PureStoryTree[],
) {
  return stories.map((story): PureStoryTree => {
    if (story.type === 'group') {
      return { ...story, children: withConfiguredDevices(config, story.children) };
    }

    return {
      ...story,
      cases: story.cases.map((_case) => {
        const resolved = config.devices.find(
          (device) => _case.device.name === device.name,
        );

        assertNotEmpty(resolved);

        return {
          ..._case,
          device: resolved as Device,
        };
      }),
    };
  });
}
