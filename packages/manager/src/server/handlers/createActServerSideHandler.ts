import {
  Channel,
  Device,
  ScreenshotAction,
  StoryID,
  TestConfig,
  TreeOP,
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
import { createPathToStory } from '../router';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';

type ActPayload = {
  id: StoryID;
  payload: ActionsAndConfig;
};

export async function createActServerSideHandler(
  app: Application,
  baseline: Baseline,
) {
  const cluster: Cluster<
    ActPayload,
    WithPossibleError<ActualServerSideResult>
  > = await Cluster.launch({
    timeout: Math.pow(2, 31) - 1,
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: 1,
    puppeteerOptions: {
      headless: 'new',
    },
  });

  await cluster.task(({ page, data }) =>
    handlePossibleErrors(() =>
      createServerResultByDevice(baseline, page, data.id, data.payload),
    ),
  );

  app.post('/api/server/act/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const payload: ActionsAndConfig = request.body;

    response.json(await cluster.execute({ id, payload }));
  });
}

async function createServerResultByDevice(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  payload: ActionsAndConfig,
) {
  await configurePageByMode(payload.config.device, page);

  await page.goto(createPathToStory(id, payload.config.presets), {
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
      animation-delay: -0.0001s !important;
      animation-duration: 0s !important;
      animation-play-state: paused !important;
      caret-color: transparent !important;
      color-adjust: exact !important;
    }
    `,
  });

  return interactWithPageAndMakeShots(baseline, page, preview, id, payload);
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
): Promise<ActualServerSideResult> {
  const screenshots: Screenshot[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      screenshots.push(
        await createScreenshot(baseline, page, id, action, config),
      );
    } else {
      await act(preview, action);
    }
  }

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
): Promise<Screenshot> {
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
