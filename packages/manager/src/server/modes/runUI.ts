import { createAttachedDriver } from '../attach/createAttachedDriver';
import { createStoryEngine } from './createStoryEngine';
import { ManagerConfig } from '../types';

export async function runUI(config: ManagerConfig) {
  const { app } = await createStoryEngine(config);

  await createAttachedDriver(app, config);
}
