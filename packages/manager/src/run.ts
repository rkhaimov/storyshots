import { not } from '@storyshots/core';
import express, { RequestHandler } from 'express';
import wsify from 'express-ws';
import { createPreviewWatcher } from './server/compiler/createPreviewWatcher';
import { createWebDriver } from './server/createWebDriver';
import { PORT } from './server/paths';
import { ServerConfig } from './server/reusables/types';

type RunConfig = ServerConfig & {
  createManagerCompiler(): RequestHandler;
};

export function run(config: RunConfig) {
  const manager = config.createManagerCompiler();

  const { app } = wsify(express());

  app.use((request, response, next) => {
    const query = request.method === 'GET' || request.method === 'HEAD';

    if (not(query)) {
      return next();
    }

    if (not('manager' in request.query && request.query.manager === 'SECRET')) {
      return config.preview.handler(request, response, next);
    }

    if (request.url.includes('/api/')) {
      return next();
    }

    const file = request.url.lastIndexOf('.') > request.url.lastIndexOf('/');

    request.url = file ? request.url : '/index.html';

    return manager(request, response, next);
  });

  createPreviewWatcher(app, config.preview);
  createWebDriver(app, config);

  app.listen(PORT);
}
