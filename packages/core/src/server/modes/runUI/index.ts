import { ManagerConfig } from '../../types';
import { createServer } from '../reusables/createServer';
import { createActHandler } from './createActHandler';
import { openAppAndGetPage } from './createAttachedDriver';

export async function runUI(config: ManagerConfig) {
  const server = await createServer(config);
  const page = await openAppAndGetPage(config);

  server.use(createActHandler(server, page));

  return server;
}
