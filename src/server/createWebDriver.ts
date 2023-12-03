import open from 'open';
import { Application } from 'express-serve-static-core';
import puppeteer, { Browser, Page } from 'puppeteer';
import { assertNotEmpty, wait } from '../reusables/utils';
import { createApiHandlers } from './handlers';
import { createBaseline } from './baseline';

export async function createWebDriver(app: Application) {
  const baseline = await createBaseline();
  const browser = await openBrowserAndCreateConnection();

  assertNotEmpty(
    browser,
    'Was not able to connect. Try to close chrome and rerun',
  );

  console.log('Browser has been acquired');
  const page = await createAndFocusPage(browser);

  console.log('Page was allocated');
  createApiHandlers(app, page, baseline);
}

async function createAndFocusPage(browser: Browser): Promise<Page> {
  const pages = await browser.pages();
  console.log('Pages was received');
  const page = await browser.newPage();

  pages.filter((it) => it.url() === 'about:blank').forEach((it) => it.close());

  console.log('Navigating');
  await page.goto('http://localhost:8080', { timeout: 0 });
  console.log('Focusing');
  await page.bringToFront();

  return page;
}

async function openBrowserAndCreateConnection(): Promise<Browser | undefined> {
  console.log('Connecting to chrome');
  await open('about:blank', {
    app: {
      name: open.apps.chrome,
      arguments: ['--remote-debugging-port=9000'],
    },
  });

  await wait(5_000);

  return createConnection();
}

async function createConnection(retries = 3): Promise<Browser | undefined> {
  if (retries === 0) {
    return undefined;
  }

  return puppeteer
    .connect({
      browserURL: `http://127.0.0.1:9000`,
      defaultViewport: null,
    })
    .catch(() => wait(3_000).then(() => createConnection(retries - 1)));
}
