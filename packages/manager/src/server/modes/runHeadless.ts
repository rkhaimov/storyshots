import wsify from 'express-ws';
import express from 'express';
import { createPreviewWatcher } from '../compiler/createPreviewWatcher';
import { createCommonApiHandlers } from '../createCommonApiHandlers';
import { ManagerConfig } from '../reusables/types';
import { createManager } from './createManager';

export async function runHeadless(config: ManagerConfig) {
  const manager = createManager();

  const { app } = wsify(express());

  app.use((request, response, next) => {
    const query = request.method === 'GET' || request.method === 'HEAD';

    if (!query) {
      return next();
    }

    if (!('manager' in request.query && request.query.manager === 'SECRET')) {
      return config.preview.handler(request, response, next);
    }

    if (request.path.includes('/api/')) {
      return next();
    }

    const file = request.path.lastIndexOf('.') > request.path.lastIndexOf('/');

    request.url = file ? request.url : '/index.html';

    return manager(request, response, next);
  });

  createPreviewWatcher(app, config.preview);
  const cleanup = await createCommonApiHandlers(app, config);

  const server = app.listen(config.port);

  return {
    app,
    cleanup: () => {
      server.close();
      cleanup();
    },
  };
}
