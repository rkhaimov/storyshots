import express from 'express';
import wsify from 'express-ws';
import { createApiHandlers } from '../handlers';
import { createPreviewUpdateHandler } from '../handlers/createPreviewUpdateHandler';
import { createManager } from '../manager-compiler';
import { ManagerConfig } from '../types';
import { createAssetsRouter } from '../createAssetsRouter';

export async function createStoryEngine(config: ManagerConfig) {
  const manager = createManager();

  const { app } = wsify(express());

  createAssetsRouter(app, config.preview.handler, manager);
  createPreviewUpdateHandler(app, config.preview);
  const cleanup = await createApiHandlers(app, config);

  const server = app.listen(6006);

  return {
    app,
    cleanup: () => {
      server.close();
      cleanup();
    },
  };
}
