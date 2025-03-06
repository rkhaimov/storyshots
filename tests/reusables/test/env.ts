import { assert, isNil } from '@storyshots/core';
import fs from 'fs';
import path from 'path';
import { Cleanup } from './description';

export async function setup() {
  await clean();

  assert(!fs.existsSync(storage));

  fs.mkdirSync(storage);

  return _createTempPath;
}

export async function teardown() {
  fs.rmSync(storage, { recursive: true, force: true });
}

export const cleanups: Cleanup[] = [];

export async function clean() {
  while (true) {
    const clean = cleanups.shift();

    if (isNil(clean)) {
      break;
    }

    await clean();
  }
}

export type CreateTempPath = typeof _createTempPath;

const _createTempPath = (folder: string) =>
  path.join(__dirname, 'temp', folder);

const storage = _createTempPath('.');
