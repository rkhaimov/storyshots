import express from 'express';
import dev from 'webpack-dev-middleware';
import wsify from 'express-ws';
import { createManagerCompiler } from './compiler/createManagerCompiler';
import { createPreviewCompiler } from './compiler/createPreviewCompiler';
import { createWebDriver } from './createWebDriver';
import { ServerConfig } from './reusables/types';
import { PORT, router } from './router';
import { createPreviewWatcher } from './compiler/createPreviewWatcher';

// TODO: Divide manager and preview differently
export function runManager(config: ServerConfig) {
  const preview = createPreviewCompiler(config);
  const manager = createManagerCompiler();

  const { app } = wsify(express());

  app.use(router);
  app.use(dev(manager));
  app.use(dev(preview));

  createPreviewWatcher(app, preview);
  createWebDriver(app, config);

  app.listen(PORT);
}
