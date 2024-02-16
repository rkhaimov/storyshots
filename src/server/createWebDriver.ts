import { Application } from 'express-serve-static-core';
import puppeteer, { Page } from 'puppeteer';
import { createApiHandlers } from './handlers';
import { createBaseline } from './reusables/baseline';
import { ServerConfig } from './reusables/types';
import path from 'path';
import { MANAGER_INDEX } from './router';

export async function createWebDriver(app: Application, config: ServerConfig) {
  const baseline = await createBaseline(config);
  const page = await openAppAndGetPage(config);

  createApiHandlers(app, page, baseline);
}

async function openAppAndGetPage(config: ServerConfig): Promise<Page> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--test-type=gpu'],
    userDataDir: path.join(config.tempDirPath, 'chrome-data'),
  });

  const [page] = await browser.pages();

  await page.goto(MANAGER_INDEX);

  return page;
}
