import { runInBackground } from '@packages/core/src/server/modes/runInBackground';
import { ManagerConfig } from '@packages/core/src/server/types';
import { createManagerConfig } from './createManagerConfig';
import { createPreview, Preview } from './preview';
import { defineManagerStep } from './test/test-description';

export type Background = {
  devices(devices: ManagerConfig['devices']): Background;
  preview(): Preview<unknown>;
};

function createBackground(devices: ManagerConfig['devices']): Background {
  return {
    devices: (devices) => createBackground(devices),
    preview: () =>
      createPreview(
        defineManagerStep((_, tf) =>
          runInBackground(createManagerConfig(devices, tf)),
        ),
      ),
  };
}

export const background = createBackground([]);
