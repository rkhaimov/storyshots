import { assertNotEmpty, StoryID } from '@storyshots/core';
import path from 'path';
import puppeteer from 'puppeteer';
import {
  getAcceptableRecords,
  getAcceptableScreenshots,
} from '../../reusables/runner/acceptables';
import { driver } from '../../reusables/runner/driver';
import { run } from '../../reusables/runner/run';
import {
  AcceptableRecord,
  AcceptableScreenshot,
  ErrorTestResult,
} from '../../reusables/runner/types';
import { CIChannel, RunnableStoriesSuit } from '../../reusables/types';
import { createManagerRootURL } from '../paths';
import { ManagerConfig } from '../reusables/types';
import { runHeadless } from './runHeadless';
import { isOnRun } from '../../reusables/runner/isOnRun';

export async function runTestsCI(config: ManagerConfig) {
  const app = await runHeadless(config);

  return {
    ...app,
    run: async () => {
      const stories = await getStories(config);

      console.log(`Received ${stories.length} stories`);

      const errors = new Map<StoryID, ErrorTestResult>();
      const records: AcceptableRecord[] = [];
      const screenshots: AcceptableScreenshot[] = [];

      console.log('Running...');
      await run(stories, new AbortController().signal, (id, result) => {
        if (isOnRun(result)) {
          return;
        }

        if (result.type === 'error') {
          errors.set(id, result);

          return;
        }

        records.push(...getAcceptableRecords(id, result.details));
        screenshots.push(...getAcceptableScreenshots(result.details));
      });

      if (errors.size > 0) {
        console.log('There are some errors...');

        for (const [id, error] of Array.from(errors.entries())) {
          console.log(id, error.message);
        }

        throw new Error('Failed to run tests, check reasons above');
      }

      console.log('Updating records...');
      for (const record of records) {
        await driver.acceptRecords(record.id, {
          records: record.result.actual,
          device: record.details.device,
        });
      }

      console.log('Updating screenshots...');
      for (const screenshot of screenshots) {
        await driver.acceptScreenshot({ actual: screenshot.result.actual });
      }

      console.log('Done');
    },
  };
}

async function getStories(
  config: ManagerConfig,
): Promise<RunnableStoriesSuit[]> {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    userDataDir: path.join(config.paths.temp, 'chrome-data'),
  });

  const page = await browser.newPage();

  await page.goto(createManagerRootURL().href, { timeout: 0 });

  const handle = await page.waitForFunction(
    () => (window as unknown as CIChannel).evaluate(),
    { timeout: 0 },
  );

  const state = await handle.jsonValue();

  assertNotEmpty(state);

  await browser.close();

  return state;
}
