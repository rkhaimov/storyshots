import express from 'express';
import path from 'path';
import { run as _run } from './run';
import { root } from './server/compiler/manager-root';
import { ServerConfig } from './server/reusables/types';

export const run = (config: ServerConfig) =>
  _run({
    ...config,
    createManagerCompiler: () => express.static(path.join(root, 'lib')),
  });

export type {
  ServerConfig,
  PreviewBundler,
  Compiler,
} from './server/reusables/types';

export { root } from './server/compiler/manager-root';
