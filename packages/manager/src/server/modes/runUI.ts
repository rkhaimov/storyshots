import { createUIAndConnectActor } from '../createUIAndConnectActor';
import { createStoryEngine } from './createStoryEngine';
import { ManagerConfig } from '../types';

export async function runUI(config: ManagerConfig) {
  const { app } = await createStoryEngine(config);

  await createUIAndConnectActor(app, config);
}
