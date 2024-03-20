import express from 'express';
import wsify from 'express-ws';
import { createManagerCompiler } from './server/compiler/createManagerCompiler';
import { createPreviewWatcher } from './server/compiler/createPreviewWatcher';
import { createWebDriver } from './server/createWebDriver';
import { ServerConfig } from './server/reusables/types';
import { PORT, router } from './server/router';

export function run(config: ServerConfig) {
  const preview = config.bundler(config);

  const manager = createManagerCompiler();

  const { app } = wsify(express());

  app.use(router);
  app.use(manager);
  preview.handle(app);

  createPreviewWatcher(app, preview);
  createWebDriver(app, config);

  app.listen(PORT);
}

export type {
  ServerConfig,
  PreviewBundler,
  Compiler,
} from './server/reusables/types';

export { root } from './server/compiler/manager-root';
