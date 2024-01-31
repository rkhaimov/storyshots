import { Baseline } from '../baseline';
import { Application } from 'express-serve-static-core';
import {
  Screenshot,
  ActualServerSideResult,
  StoryID,
  WithPossibleError,
} from '../../reusables/types';
import { ActionMeta } from '../../reusables/actions';
import puppeteer from 'puppeteer';
import { act, toPreviewFrame } from '../act';

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
    const others: Screenshot[] = [];
    for (const action of actions) {
      if (action.action !== 'screenshot') {
        await act(preview, action);

        continue;
      }

      const path = await baseline.createActualScreenshot(
        id,
        action.payload.name,
        await page.screenshot({ type: 'png' }),
      );

      others.push({
        name: action.payload.name,
        path,
      });
    }

    const screenshots = {
      final: await baseline.createActualScreenshot(
        id,
        undefined,
        await page.screenshot({ type: 'png' }),
      ),
      others,
    };

    const result: WithPossibleError<ActualServerSideResult> = {
      type: 'success',
      data: {
        records: await preview.evaluate(() => window.readJournalRecords()),
        screenshots,
      },
    };

    await browser.close();

    response.json(result);
  });
}
