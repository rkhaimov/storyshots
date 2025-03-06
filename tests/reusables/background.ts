import { ManagerConfig } from '@storyshots/manager';
import { createCITestsFactory } from './factories';
import { createPreview, Preview } from './preview';

export type Background = {
  devices(devices: ManagerConfig['devices']): Background;
  preview(): Preview<unknown>;
};

function createBackground(devices: ManagerConfig['devices']): Background {
  return {
    devices: (devices) => createBackground(devices),
    preview: () => createPreview(createCITestsFactory(devices)),
  };
}

export const background = createBackground([]);
