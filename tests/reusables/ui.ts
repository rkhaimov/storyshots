import { ManagerConfig } from '@storyshots/manager';
import { createUITestsFactory } from './factories';
import { createPreview, Preview } from './preview';

export type UI = {
  devices(devices: ManagerConfig['devices']): UI;
  preview(): Preview<unknown>;
};

function createUI(devices: ManagerConfig['devices']): UI {
  return {
    devices: (devices) => createUI(devices),
    preview: () => createPreview(createUITestsFactory(devices)),
  };
}

export const ui = createUI([]);
