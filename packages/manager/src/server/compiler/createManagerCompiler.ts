import dev from 'webpack-dev-middleware';
import webpack from 'webpack';
import express from 'express';
import { config } from './manager-config';
import { root } from './manager-root';
import path from 'path';

export function createManagerCompiler() {
  return process.env['STORYSHOTS_BUILD_MODE'] === 'development'
    ? dev(webpack(config))
    : express.static(path.join(root, 'lib'));
}
