import { Application } from 'express-serve-static-core';
import puppeteer, { Frame, Page } from 'puppeteer';
import { ScreenshotAction } from '../../reusables/actions';
import {
  ActionsAndMode,
  ActualServerSideResult,
  PageMode,
  Screenshot,
  ScreenshotPath,
  StoryID,
  WithPossibleError,
} from '../../reusables/types';
import { act, toPreviewFrame } from '../act';
import { Baseline } from '../baseline';
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
  await configurePageByMode(payload.mode, page);

  await page.goto(`http://localhost:8080/chromium/${id}`, {
    waitUntil: 'networkidle0',
  });

  const preview = await toPreviewFrame(page);

  return interactWithPageAndMakeShots(baseline, page, preview, id, payload);
}

async function configurePageByMode(mode: PageMode, page: Page) {
  switch (mode.type) {
    case 'viewport':
      return page.setViewport(mode.viewport);
    case 'device':
      return page.emulate(mode.device);
  }
}

async function interactWithPageAndMakeShots(
  baseline: Baseline,
  page: Page,
  preview: Frame,
  id: StoryID,
  { mode, actions }: ActionsAndMode,
): Promise<WithPossibleError<ActualServerSideResult>> {
  const others: Screenshot[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      const result = await createScreenshot(baseline, page, id, action, mode);

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

  const final = await createFinalScreenshot(baseline, page, id, mode);

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
  mode: PageMode,
): Promise<WithPossibleError<Screenshot>> {
  return WithPossibleErrorOP.fromThrowable(async () => {
    const path = await baseline.createActualScreenshot(
      id,
      mode,
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
  mode: PageMode,
): Promise<WithPossibleError<ScreenshotPath>> {
  return WithPossibleErrorOP.fromThrowable(async () => {
    return baseline.createActualScreenshot(
      id,
      mode,
      undefined,
      await page.screenshot({ type: 'png' }),
    );
  });
}
