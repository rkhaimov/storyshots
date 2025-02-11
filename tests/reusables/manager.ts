import { ManagerConfig } from '@storyshots/manager';
import { createManagerTestsFactory } from './factories';
import { createPreview, Preview } from './preview';

type Manager = {
  devices(devices: ManagerConfig['devices']): Manager;
  preview(): Preview<unknown>;
};

function createManager(devices: ManagerConfig['devices']): Manager {
  return {
    devices: (devices) => createManager(devices),
    preview: () => createPreview(createManagerTestsFactory(devices)),
  };
}

export const manager = createManager([]);
