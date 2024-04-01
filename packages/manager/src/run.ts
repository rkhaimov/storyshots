import express, { RequestHandler } from 'express';
import wsify from 'express-ws';
import { createPreviewWatcher } from './server/compiler/createPreviewWatcher';
import { createWebDriver } from './server/createWebDriver';
import { ServerConfig } from './server/reusables/types';
import { PORT, router } from './server/router';

type RunConfig = ServerConfig & {
  createManagerCompiler(): RequestHandler;
};

export function run(config: RunConfig) {
  const preview = config.bundler(config);
  const manager = config.createManagerCompiler();

  const { app } = wsify(express());

  app.use(router);
  app.use(manager);
  preview.handle(app);

  createPreviewWatcher(app, preview);
  createWebDriver(app, config);

  app.listen(PORT);
}
