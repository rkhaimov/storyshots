import express from 'express';
import wsify from 'express-ws';
import dev from 'webpack-dev-middleware';
import { createPreviewCompiler } from './server/compiler/createPreviewCompiler';
import { createPreviewWatcher } from './server/compiler/createPreviewWatcher';
import { createWebDriver } from './server/createWebDriver';
import { ServerConfig } from './server/reusables/types';
import { PORT, router } from './server/router';
import { createManagerCompiler } from './server/compiler/createManagerCompiler';

export function run(config: ServerConfig) {
  const preview = createPreviewCompiler(config);
  const manager = createManagerCompiler();

  const { app } = wsify(express());

  app.use(router);
  app.use(manager);
  app.use(dev(preview));

  createPreviewWatcher(app, preview);
  createWebDriver(app, config);

  app.listen(PORT);
}
