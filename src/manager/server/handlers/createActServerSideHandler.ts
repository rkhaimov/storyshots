import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { ScreenshotAction } from '../../../reusables/actions';
import { StoryID } from '../../../reusables/story';
import { Device } from '../../../reusables/test-presets';
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
import { TreeOP } from '../../../reusables/tree';

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
  await configurePageByMode(payload.device, page);

  await page.goto(createPathToStory(id), {
    waitUntil: 'networkidle0',
  });

  const preview = await toPreviewFrame(page);

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
  { device, actions }: ActionsOnDevice,
): Promise<ActualServerSideResult> {
  const others: Screenshot[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      others.push(await createScreenshot(baseline, page, id, action, device));
    } else {
      await act(preview, action);
    }
  }

  const final = await createFinalScreenshot(baseline, page, id, device);

  const records = await preview.evaluate(() => window.readJournalRecords());

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
  device: Device,
): Promise<Screenshot> {
  const path = await baseline.createActualScreenshot(
    id,
    device,
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
  device: Device,
): Promise<ScreenshotPath> {
  return baseline.createActualScreenshot(
    id,
    device,
    undefined,
    await page.screenshot({ type: 'png' }),
  );
}
