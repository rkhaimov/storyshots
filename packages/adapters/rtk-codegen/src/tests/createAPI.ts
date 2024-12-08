import fs from 'fs';
import { http } from 'msw';
import path from 'path';
import { createTestableEndpoints } from '../createTestableEndpoints';
import { RequestHandlerMeta } from '../types';
import { ItUtils } from './it';

export async function createAPI(
  { toMatchSnapshot, interceptor }: ItUtils,
  schema: string,
  handlers: Record<string, (input: unknown) => unknown>,
): Promise<
  Disposable & { fetch(url: string, init?: RequestInit): Promise<unknown> }
> {
  const files = await createTestableEndpoints('UsersAPI', {
    schemaFile: path.join(__dirname, schema),
    apiFile: './api.ts',
    outputFile: path.join(__dirname, 'users-api.ts'),
  });

  for (const [file, content] of Object.entries(files)) {
    toMatchSnapshot(path.basename(file), content);

    fs.writeFileSync(file, content);
  }

  const api = require('./users-api.storyshots') as {
    createUsersAPIMeta(
      repository: Record<string, (input: unknown) => unknown>,
    ): RequestHandlerMeta[];
  };

  interceptor.handle(
    ...api
      .createUsersAPIMeta(handlers)
      .map((meta) =>
        http[meta.method](`http://localhost${meta.path}`, meta.handler),
      ),
  );

  return {
    fetch: async (url, init) => {
      const response = await fetch(`http://localhost${url}`, init);

      return {
        status: response.status,
        body: response.body === null ? null : await response.json(),
      };
    },
    [Symbol.dispose]: () => {
      for (const [file] of Object.entries(files)) {
        fs.unlinkSync(file);
      }
    },
  };
}
