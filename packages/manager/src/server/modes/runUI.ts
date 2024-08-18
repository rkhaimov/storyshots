import { createHeadAndConnect } from '../handlers/createHeadAndConnect';
import { runHeadless } from './runHeadless';
import { ManagerConfig } from '../reusables/types';

export async function runUI(config: ManagerConfig) {
  const { app } = await runHeadless(config);

  await createHeadAndConnect(app, config);
}
