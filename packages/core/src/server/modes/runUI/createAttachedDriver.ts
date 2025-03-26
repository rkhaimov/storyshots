import path from 'path';
import { chromium, Page } from 'playwright';
import { createManagerRootURL } from '../../paths';
import { ManagerConfig } from '../../types';

export async function openAppAndGetPage(config: ManagerConfig): Promise<Page> {
  const context = await chromium.launchPersistentContext(
    path.join(config.paths.temp, 'chrome-data'),
    {
      timeout: 0,
      headless: false,
      viewport: null,
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        `--app=${createManagerRootURL(config).href}`,
        '--start-maximized',
        '--test-type=gpu',
        ...createDevtoolsArgs(config),
      ],
    },
  );

  context.setDefaultTimeout(10_000);

  const [page] = context.pages();

  return page;
}

function createDevtoolsArgs(config: ManagerConfig): string[] {
  return config.devtools
    ? [
        `--disable-extensions-except=${config.devtools}`,
        `--load-extension=${config.devtools}`,
      ]
    : [];
}
