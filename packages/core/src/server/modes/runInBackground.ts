import { assertNotEmpty } from '@lib';
import { chromium } from 'playwright';
import { driver } from '../../reusables/runner/driver';
import { createManagerRootURL } from '../paths';
import { ManagerConfig } from '../types';
import { createServer } from './reusables/createServer';

export async function runInBackground(config: ManagerConfig) {
  const server = await createServer(config);

  return {
    ...server,
    run: async () => {
      const browser = await chromium.launch();

      const page = await browser.newPage();

      await page.goto(createManagerRootURL(config).href, { timeout: 0 });

      const handle = await page.waitForFunction(() => window.runAll(), null, {
        timeout: 0,
      });

      const summary = await handle.jsonValue();

      assertNotEmpty(summary);

      await browser.close();

      if (summary.errors.length > 0) {
        throw new Error('Failed to run tests, check errors above');
      }

      if (summary.changes.length > 0) {
        console.log('Baseline changes has been detected, commiting...');
      }

      for (const change of summary.changes) {
        if (change.records) {
          await driver.acceptRecords({
            id: change.id,
            device: change.device,
            records: change.records,
          });
        }

        for (const screenshot of change.screenshots) {
          await driver.acceptScreenshot(screenshot);
        }
      }

      console.log('Done');
    },
  };
}
