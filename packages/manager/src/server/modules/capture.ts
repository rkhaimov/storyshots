import { wait } from '@storyshots/core';
import { Page } from 'playwright';
import { Story } from '../reusables/types';
import { ManagerConfig } from '../types';

export type Capture = (config: CaptureConfig) => Promise<Buffer>;

type CaptureConfig = {
  capture: () => Promise<Buffer>;
  story: Story;
  manager: ManagerConfig;
  page: Page;
};

export const CAPTURE = {
  instantly,
  stabilized,
};

type CaptureStabilizerConfig = {
  attempts: number;
  interval(attempt: number): number;
};

function stabilized(config: CaptureStabilizerConfig): Capture {
  const stabilizer = async (
    last: Buffer,
    capture: () => Promise<Buffer>,
    attempt = 0,
  ): Promise<Buffer> => {
    if (attempt === config.attempts) {
      return last;
    }

    await wait(config.interval(attempt));

    const curr = await capture();

    if (Buffer.from(last).equals(curr)) {
      return curr;
    }

    return stabilizer(curr, capture, attempt + 1);
  };

  return async ({ capture }) => stabilizer(await capture(), capture);
}

function instantly(): Capture {
  return ({ capture }) => capture();
}
