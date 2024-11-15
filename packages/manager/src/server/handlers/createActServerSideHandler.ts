import {
  Channel,
  Device,
  ScreenshotAction,
  StoryID,
  TestConfig,
  TreeOP,
  wait,
} from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import {
  ActionsAndConfig,
  ActualServerSideResult,
  Screenshot,
  WithPossibleError,
} from '../../reusables/types';
import { act } from '../reusables/act';
import { Baseline } from '../reusables/baseline';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { ManagerConfig } from '../reusables/types';
import { createPathToStory } from '../paths';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';

type ActPayload = {
  id: StoryID;
  payload: ActionsAndConfig;
};

export async function createActServerSideHandler(
  app: Application,
  baseline: Baseline,
  config: ManagerConfig,
) {
  const cluster: Cluster<
    ActPayload,
    WithPossibleError<ActualServerSideResult>
  > = await Cluster.launch({
    timeout: Math.pow(2, 31) - 1,
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: config.optimization.agentsCount,
    puppeteerOptions: {
      headless: true,
    },
  });

  await cluster.task(({ page, data }) =>
    handlePossibleErrors(() =>
      createServerResultByDevice(baseline, page, data.id, data.payload, config),
    ),
  );

  app.post('/api/server/act/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const payload: ActionsAndConfig = request.body;

    response.json(await cluster.execute({ id, payload }));
  });

  return cluster.close.bind(cluster);
}

async function createServerResultByDevice(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  payload: ActionsAndConfig,
  config: ManagerConfig,
) {
  await configurePageByMode(payload.config.device, page);

  await page.goto(createPathToStory(id, payload.config, config), {
    waitUntil: 'networkidle0',
  });

  const preview = await toPreviewFrame(page);

  await preview.addStyleTag({
    content: `
    *,
    *::after,
    *::before {
      transition-delay: 0s !important;
      transition-duration: 0s !important;
      animation-delay: 0s !important;
      animation-duration: 0s !important;
      animation-play-state: paused !important;
      caret-color: transparent !important;
    }
    `,
  });

  return interactWithPageAndMakeShots(
    baseline,
    page,
    preview,
    id,
    payload,
    config,
  );
}

async function configurePageByMode(device: Device, page: Page) {
  switch (device.type) {
    case 'size-only':
      return page.setViewport(device.config);
    case 'emulated':
      return page.emulate({
        viewport: device.config,
        userAgent: device.config.userAgent,
      });
  }
}

async function interactWithPageAndMakeShots(
  baseline: Baseline,
  page: Page,
  preview: Frame,
  id: StoryID,
  { actions, config }: ActionsAndConfig,
  server: ManagerConfig,
): Promise<ActualServerSideResult> {
  const screenshots: Screenshot[] = [];

  await act(
    preview,
    actions,
    async (action) =>
      void screenshots.push(
        await createScreenshot(baseline, page, id, action, config, server),
      ),
  );

  const records = await preview.evaluate(() =>
    (window as never as Channel).records(),
  );

  return {
    records,
    screenshots,
  };
}

async function createScreenshot(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  action: ScreenshotAction,
  config: TestConfig,
  server: ManagerConfig,
): Promise<Screenshot> {
  await server.optimization.stabilize(page, id, action, config);

  const path = await baseline.createActualScreenshot(
    id,
    config,
    action.payload.name,
    await page.screenshot({ type: 'png' }),
  );

  return {
    name: action.payload.name,
    path,
  };
}

export type Stabilizer = (
  page: Page,
  id: StoryID,
  action: ScreenshotAction,
  config: TestConfig,
) => Promise<void>;

const none: Stabilizer = async () => {};

type ImageStabilizerConfig = {
  attempts: number;
  interval(attempt: number): number;
};

const byImage = (config: ImageStabilizerConfig): Stabilizer => {
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
};

export const STABILIZER = {
  none,
  byImage,
};
