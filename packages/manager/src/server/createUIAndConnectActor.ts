import { ActionMeta } from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import path from 'path';
import { chromium, Page } from 'playwright';
import { WithPossibleError } from '../reusables/types';
import { act } from './act';
import { handlePossibleErrors } from './handlers/reusables/handlePossibleErrors';
import { toPreviewFrame } from './handlers/reusables/toPreviewFrame';
import { createManagerRootURL } from './paths';
import { ManagerConfig } from './types';

export async function createUIAndConnectActor(
  app: Application,
  config: ManagerConfig,
) {
  const page = await openAppAndGetPage(config);

  // TODO: Implement cancellation
  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const result: WithPossibleError<void> = await handlePossibleErrors(
      async () => {
        const preview = await toPreviewFrame(page);

        for (const action of actions) {
          if (action.action === 'screenshot') {
            continue;
          }

          await act(preview, action);
        }
      },
    );

    response.json(result);
  });
}

async function openAppAndGetPage(config: ManagerConfig): Promise<Page> {
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
