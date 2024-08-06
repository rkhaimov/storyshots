import express from 'express';
import path from 'path';
import { run as _run } from './run';
import { ServerConfig } from './server/reusables/types';
import { root } from './server/compiler/manager-root';

export const run = (config: ServerConfig) =>
  _run({
    ...config,
    createManagerCompiler: () =>
      express.static(path.join(root, 'lib', 'client')),
  });

export type { ServerConfig, PreviewServe } from './server/reusables/types';

export { root } from './server/compiler/manager-root';
