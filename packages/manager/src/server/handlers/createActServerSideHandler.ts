import {
  Channel,
  Device,
  ScreenshotAction,
  StoryID,
  TreeOP,
} from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { TestConfig } from '../../client/behaviour/useTestResults/types';
import {
  ActionsOnDevice,
  ActualServerSideResult,
  Screenshot,
  ScreenshotPath,
  WithPossibleError,
} from '../../reusables/types';
import { act } from '../reusables/act';
import { Baseline } from '../reusables/baseline';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { createPathToStory } from '../router';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';

type ActPayload = {
  id: StoryID;
  payload: ActionsOnDevice;
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
    const payload: ActionsOnDevice = request.body;

    response.json(await cluster.execute({ id, payload }));
  });
}

async function createServerResultByDevice(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  payload: ActionsOnDevice,
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
    case 'viewport-only':
      return page.setViewport(device.viewport);
    case 'complete':
      return page.emulate(device.config);
  }
}

async function interactWithPageAndMakeShots(
  baseline: Baseline,
  page: Page,
  preview: Frame,
  id: StoryID,
  { actions, config }: ActionsOnDevice,
): Promise<ActualServerSideResult> {
  const others: Screenshot[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      others.push(await createScreenshot(baseline, page, id, action, config));
    } else {
      await act(preview, action);
    }
  }

  const final = await createFinalScreenshot(baseline, page, id, config);

  const records = await preview.evaluate(() =>
    (window as never as Channel).records(),
  );

  return {
    records,
    screenshots: {
      final,
      others,
    },
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

async function createFinalScreenshot(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  config: TestConfig,
): Promise<ScreenshotPath> {
  return baseline.createActualScreenshot(
    id,
    config,
    undefined,
    await page.screenshot({ type: 'png' }),
  );
}
