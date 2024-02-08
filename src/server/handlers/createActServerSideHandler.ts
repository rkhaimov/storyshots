import { Application } from 'express-serve-static-core';
import puppeteer, { Frame, Page } from 'puppeteer';
import { ScreenshotAction } from '../../reusables/actions';
import {
  ActionsAndMode,
  ActualServerSideResult,
  Device,
  Screenshot,
  ScreenshotPath,
  StoryID,
  WithPossibleError,
} from '../../reusables/types';
import { act } from '../reusables/act';
import { Baseline } from '../reusables/baseline';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { WithPossibleErrorOP } from './reusables/with-possible-error';

export function createActServerSideHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/server/act/:id', async (request, response) => {
    const id = request.params.id as StoryID;
    const payload: ActionsAndMode = request.body;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const results = await createServerResultByPageMode(
      baseline,
      page,
      id,
      payload,
    );

    await browser.close();

    response.json(results);
  });
}

async function createServerResultByPageMode(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  payload: ActionsAndMode,
) {
  await configurePageByMode(payload.device, page);

  await page.goto(`http://localhost:8080/chromium/${id}`, {
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
  { device, actions }: ActionsAndMode,
): Promise<WithPossibleError<ActualServerSideResult>> {
  const others: Screenshot[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      const result = await createScreenshot(baseline, page, id, action, device);

      if (result.type === 'error') {
        return result;
      }

      others.push(result.data);
    } else {
      const result = await act(preview, action);

      if (result.type === 'error') {
        return result;
      }
    }
  }

  const final = await createFinalScreenshot(baseline, page, id, device);

  if (final.type === 'error') {
    return final;
  }

  const records = await WithPossibleErrorOP.fromThrowable(() =>
    preview.evaluate(() => window.readJournalRecords()),
  );

  if (records.type === 'error') {
    return records;
  }

  return {
    type: 'success',
    data: {
      records: records.data,
      screenshots: {
        final: final.data,
        others: others,
      },
    },
  };
}

async function createScreenshot(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  action: ScreenshotAction,
  device: Device,
): Promise<WithPossibleError<Screenshot>> {
  return WithPossibleErrorOP.fromThrowable(async () => {
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
  });
}

async function createFinalScreenshot(
  baseline: Baseline,
  page: Page,
  id: StoryID,
  device: Device,
): Promise<WithPossibleError<ScreenshotPath>> {
  return WithPossibleErrorOP.fromThrowable(async () => {
    return baseline.createActualScreenshot(
      id,
      device,
      undefined,
      await page.screenshot({ type: 'png' }),
    );
  });
}
