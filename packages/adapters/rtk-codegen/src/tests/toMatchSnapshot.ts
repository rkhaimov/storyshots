import { not } from '@storyshots/core';
import fs from 'fs';
import path from 'path';

export function toMatchSnapshot(
  message: string,
  data: Record<string, unknown>,
) {
  const actual = Object.entries(data)
    .flatMap(([key, value]) => [
      `--- START ${key} ---`,
      typeof value === 'string'
        ? value
        : value === undefined
          ? 'undefined'
          : JSON.stringify(value, null, 2),
      `--- END ${key} ---`,
      '',
    ])
    .join('\n');

  const snapshot = path.join(__dirname, `${message.replace(/ /g, '_')}.txt`);

  if (not(fs.existsSync(snapshot))) {
    fs.writeFileSync(snapshot, actual);

    return;
  }

  const expected = fs.readFileSync(snapshot).toString();

  if (expected === actual) {
    return;
  }

  throw Error(message);
}
