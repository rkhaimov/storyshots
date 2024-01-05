import { Application } from 'express-serve-static-core';
import puppeteer, { Browser, Page } from 'puppeteer';
import { assertNotEmpty, wait } from '../reusables/utils';
import { createAPIHandlers } from './createAPIHandlers';

// TODO: Implement basic ws channel
export async function createWebDriver(app: Application) {
  const browser = await createBrowserConnection();

  assertNotEmpty(browser, 'Was not able to connect. Please, try again');

  const page = await createPage(browser);

  await page.bringToFront();

  createAPIHandlers(app, page);
}

async function createPage(browser: Browser): Promise<Page> {
  const pages = await browser.pages();

  const old = pages.filter(
    (it) => it.url().includes('localhost:8080') || it.url() === ':',
  );

  const page = await browser.newPage();

  await Promise.all([
    ...old.map((it) => it.close()),
    page.goto('http://localhost:8080/'),
  ]);

  return page;
}

async function createBrowserConnection(
  retries = 10,
): Promise<Browser | undefined> {
  if (retries === 0) {
    return undefined;
  }

  await wait(1_000);

  return puppeteer
    .connect({
      browserURL: `http://127.0.0.1:9000`,
      defaultViewport: null,
    })
    .catch(() => createBrowserConnection(retries - 1));
}

