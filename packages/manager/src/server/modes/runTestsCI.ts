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
    headless: true,
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

  await waitForAllRunsAreDone(frame);

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

    if (acceptAll !== null) {
      await acceptAll.click();
    }
  }

  await waitForAllDone(frame);

  console.log('DONE');
}

async function waitForAllRunsAreDone(frame: Frame) {
  while (true) {
    const element = await frame.$(
      '::-p-aria([role="generic"][name="Status"]) ::-p-aria([role="image"][name="loading"])',
    );

    await wait(1_000);

    if (element === null) {
      break;
    }
  }
}

async function waitForAllDone(frame: Frame) {
  while (true) {
    const fresh = await frame.$('::-p-aria([role="image"][name="fresh"])');
    const fail = await frame.$('::-p-aria([role="image"][name="close"])');

    if (fresh === null && fail === null) {
      return;
    }

    await wait(1_000);
  }
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
