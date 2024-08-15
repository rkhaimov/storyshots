import { Application } from 'express-serve-static-core';
import path from 'path';
import puppeteer, { Page } from 'puppeteer';
import { createApiHandlers } from './handlers';
import { createBaseline } from './reusables/baseline';
import { ServerConfig } from './reusables/types';
import { HOST } from './paths';

export async function createWebDriver(app: Application, config: ServerConfig) {
  const baseline = await createBaseline(config);
  const page = await openAppAndGetPage(config);

  createApiHandlers(app, page, baseline, config);
}

async function openAppAndGetPage(config: ServerConfig): Promise<Page> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      `--app=${HOST}`,
      '--start-maximized',
      '--test-type=gpu',
      `--disable-extensions-except=${config.devtools}`,
      `--load-extension=${config.devtools}`,
    ],
    userDataDir: path.join(config.paths.temp, 'chrome-data'),
  });

  const [page] = await browser.pages();

  return page;
}
