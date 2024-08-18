import { ManagerConfig } from '../reusables/types';
import { runHeadless } from './runHeadless';
import puppeteer, { Frame } from 'puppeteer';
import path from 'path';
import { getManagerHost } from '../paths';
import { assertNotEmpty, wait } from '@storyshots/core';

export async function runTestsCI(config: ManagerConfig) {
  const app = await runHeadless(config);

  await runAllTests(config);

  return app;
}

async function runAllTests(config: ManagerConfig) {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    userDataDir: path.join(config.paths.temp, 'chrome-data'),
  });

  const page = await browser.newPage();

  await page.goto(getManagerHost(config), { timeout: 0 });

  const frame = page.mainFrame();

  console.log('Waiting tests to initialize...');

  const runAll = await frame.waitForSelector(
    '::-p-aria([role="button"][name="Run complete"])',
    { timeout: 0 },
  );

  assertNotEmpty(runAll);

  console.log('Tests are being started...');

  await runAll.click();

  printProgress(frame);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const element = await frame.$(
      '::-p-aria([role="generic"][name="Status"]) ::-p-aria([role="image"][name="loading"])',
    );

    await wait(1_000);

    if (element === null) {
      break;
    }
  }

  const stories = await frame.$$(
    '::-p-aria([role="list"][name="Stories 0"]) ::-p-aria([role="menuitem"])',
  );

  for (const story of stories) {
    const error = await story.$(
      '::-p-aria([role="image"][name="exclamation"])',
    );

    if (error !== null) {
      throw new Error(
        'One or more stories are failed to run. Please investigate problem locally',
      );
    }

    await story.hover();

    const acceptAll = await story.$(
      '::-p-aria([role="button"][name="Accept all"])',
    );

    if (acceptAll === null) {
      continue;
    }

    await acceptAll.click();

    while (true) {
      const done = await story.$('::-p-aria([role="image"][name="check"])');

      if (done === null) {
        await wait(100);
      } else {
        break;
      }
    }
  }

  console.log('DONE');
}

async function printProgress(frame: Frame) {
  while (true) {
    const current = await frame.$('::-p-aria([role="link"][name="Progress"])');

    assertNotEmpty(current);

    console.clear();
    console.log(
      await current.evaluate(
        (element) => (element as HTMLAnchorElement).innerText,
      ),
    );

    await wait(1_000);
  }
}
