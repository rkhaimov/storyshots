import open from 'open';
import { Application } from 'express-serve-static-core';
import puppeteer, { Browser, Page } from 'puppeteer';
import { assertNotEmpty, wait } from '../reusables/utils';
import { createApiHandlers } from './handlers';
import { createBaseline } from './reusables/baseline';
import { ServerConfig } from './reusables/types';

export async function createWebDriver(app: Application, config: ServerConfig) {
  const baseline = await createBaseline(config);
  const browser = await openBrowserAndCreateConnection();

  assertNotEmpty(
    browser,
    'Was not able to connect. Try to close chrome and rerun',
  );

  const page = await createAndFocusPage(browser);

  createApiHandlers(app, page, baseline);
}

async function createAndFocusPage(browser: Browser): Promise<Page> {
  const pages = await browser.pages();
  const page = await browser.newPage();

  pages.filter((it) => it.url() === 'about:blank').forEach((it) => it.close());

  await page.goto('http://localhost:8080', { timeout: 0 });
  await page.bringToFront();

  return page;
}

async function openBrowserAndCreateConnection(): Promise<Browser | undefined> {
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
