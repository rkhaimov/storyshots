import { createServer } from '@packages/core/src/server/modes/reusables/createServer';
import { createManagerRootURL } from '@packages/core/src/server/paths';
import { ManagerConfig } from '@packages/core/src/server/types';
import { createManagerConfig } from './createManagerConfig';
import { createPreview, Preview } from './preview';
import { defineManagerStep } from './test/test-description';

export type UI = {
  devices(devices: ManagerConfig['devices']): UI;
  preview(): Preview<unknown>;
};

function createUI(devices: ManagerConfig['devices']): UI {
  return {
    devices: (devices) => createUI(devices),
    preview: () =>
      createPreview(
        defineManagerStep(async (page, tf) => {
          const config = createManagerConfig(devices, tf);
          const { cleanup } = await createServer(config);

          return {
            cleanup,
            run: async () => {
              await page.goto(createManagerRootURL(config).href);

              // TODO: Act calls are being ignored. They should be recorded
              await page.route('**/*/api/client/act*', (route) =>
                route.fulfill({ json: { type: 'success' } }),
              );
            },
          };
        }),
      ),
  };
}

export const ui = createUI([]);
