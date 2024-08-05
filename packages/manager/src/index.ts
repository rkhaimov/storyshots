import express from 'express';
import { run as _run } from './run';
import manager from './server/compiler/manager-config';
import { ServerConfig } from './server/reusables/types';

export const run = (config: ServerConfig) =>
  _run({
    ...config,
    createManagerCompiler: () => express.static(manager.output.path),
  });

export type { ServerConfig, PreviewServe } from './server/reusables/types';

export { root } from './server/compiler/manager-root';
