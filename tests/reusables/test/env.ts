import { assert, isNil } from '@storyshots/core';
import fs from 'fs';
import path from 'path';

export function setup() {
  assert(cleanups.length === 0);
  assert(!fs.existsSync(storage));

  fs.mkdirSync(storage);

  return _createTempPath;
}

export async function teardown() {
  while (true) {
    const clean = cleanups.shift();

    if (isNil(clean)) {
      break;
    }

    await clean();
  }

  fs.rmSync(storage, { recursive: true, force: true });
}

export const cleanups: Array<() => Promise<void>> = [];

export type CreateTempPath = typeof _createTempPath;

const _createTempPath = (folder: string) =>
  path.join(__dirname, 'temp', folder);

const storage = _createTempPath('.');
