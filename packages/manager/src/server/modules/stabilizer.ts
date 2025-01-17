import { ScreenshotAction, StoryID, TestConfig, wait } from '@storyshots/core';
import { Page } from 'puppeteer';

export type Stabilizer = (
  page: Page,
  id: StoryID,
  action: ScreenshotAction,
  config: TestConfig,
) => Promise<void>;

export const STABILIZER = {
  none,
  byImage,
};

type ImageStabilizerConfig = {
  attempts: number;
  interval(attempt: number): number;
};

function byImage(config: ImageStabilizerConfig): Stabilizer {
  const stabilizer = async (
    story: StoryID,
    page: Page,
    last: Uint8Array,
    attempt = 0,
  ): Promise<void> => {
    if (attempt === config.attempts) {
      return;
    }

    await wait(config.interval(attempt));

    const curr = await page.screenshot({ type: 'png' });

    if (Buffer.from(last).equals(curr)) {
      return;
    }

    return stabilizer(story, page, curr, attempt + 1);
  };

  return async (page, id) =>
    stabilizer(id, page, await page.screenshot({ type: 'png' }));
}

async function none() {}
