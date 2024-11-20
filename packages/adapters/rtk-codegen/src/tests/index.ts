import { not } from '@storyshots/core';
import fs from 'fs';
import path from 'path';
import { createTestableEndpoints } from '../createTestableEndpoints';

void tests();

async function tests() {
  await it('generates no args get request', async (toMatchSnapshot) => {
    const response = await createTestableEndpoints('UsersAPI', {
      schemaFile: path.join(__dirname, './no-args-get.json'),
      apiFile: './api.ts',
      outputFile: './users-api.ts',
    });

    toMatchSnapshot(response);
  });

  await it('generates no args get request', async (toMatchSnapshot) => {
    const response = await createTestableEndpoints('UsersAPI', {
      schemaFile: path.join(__dirname, './path-arg-get.json'),
      apiFile: './api.ts',
      outputFile: './users-api.ts',
      flattenArg: true,
    });

    // console.log(response['./users-api.ts']);
    // console.log(response['./users-api.testable.ts']);
  });
}

async function it(
  message: string,
  operation: (
    toMatchSnapshot: (data: Record<string, string>) => void,
  ) => Promise<void>,
) {
  console.log('it', message);

  await operation((data) => toMatchSnapshot(message, data));
}

function toMatchSnapshot(message: string, data: Record<string, string>) {
  const actual = Object.entries(data)
    .flatMap(([key, value]) => [
      `--- START OF FILE ${key} ---`,
      '',
      value,
      `--- END OF FILE ${key} ---`,
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
