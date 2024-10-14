import express from 'express';
import path from 'path';
import { root } from '../compiler/manager-root';
import managerConfig from '../compiler/manager-config';
import { webpack } from 'webpack';
import dev from 'webpack-dev-middleware';

function createHOTManager() {
  return dev(webpack(managerConfig));
}

function createPrebuiltManager() {
  return express.static(path.join(root, 'lib', 'client'));
}

export const createManager = createPrebuiltManager;
