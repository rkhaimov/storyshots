import express from 'express';
import dev from 'webpack-dev-middleware';
import { createManagerCompiler } from './compiler/createManagerCompiler';
import { createPreviewCompiler } from './compiler/createPreviewCompiler';
import { createWebDriver } from './createWebDriver';
import { ServerConfig } from './reusables/types';
import { PORT, router } from './router';

export function run(config: ServerConfig) {
  const preview = createPreviewCompiler(config);
  const manager = createManagerCompiler();

  const app = express();

  app.use(router);
  app.use(dev(manager));
  app.use(dev(preview));

  createWebDriver(app, config);

  app.listen(PORT);
}
