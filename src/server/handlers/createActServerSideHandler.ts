import { Application } from 'express-serve-static-core';
import puppeteer, { Frame, Page } from 'puppeteer';
import { ActionMeta, ScreenshotAction } from '../../reusables/actions';
import {
  ActualServerSideResult,
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
    const actions: ActionMeta[] = request.body;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1480, height: 920 });
    await page.goto(`http://localhost:8080/chromium/${id}`);

    const preview = await toPreviewFrame(page);

    const result = await createActServerResult(
      baseline,
      page,
      preview,
      id,
      actions,
    );

    await browser.close();

    response.json(result);
  });
}

async function createActServerResult(
  baseline: Baseline,
  page: Page,
  preview: Frame,
  id: StoryID,
  actions: ActionMeta[],
): Promise<WithPossibleError<ActualServerSideResult>> {
  const others: Screenshot[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      const result = await createScreenshot(baseline, page, id, action);

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

  const final = await createFinalScreenshot(baseline, page, id);

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
): Promise<WithPossibleError<Screenshot>> {
  return WithPossibleErrorOP.fromThrowable(async () => {
    const path = await baseline.createActualScreenshot(
      id,
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
): Promise<WithPossibleError<ScreenshotPath>> {
  return WithPossibleErrorOP.fromThrowable(async () => {
    return baseline.createActualScreenshot(
      id,
      undefined,
      await page.screenshot({ type: 'png' }),
    );
  });
}
