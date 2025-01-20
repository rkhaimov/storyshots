import express from 'express';
import path from 'path';
import { root } from './root';

function createPrebuiltManager() {
  return express.static(path.join(root, 'lib', 'client'));
}

export const createManager = createPrebuiltManager;
