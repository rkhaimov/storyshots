import type { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { assert } from '@storyshots/core';

export const createErrorHTTPResponse = (error: {
  status: number;
  data?: unknown;
}): never => {
  throw new HTTPResponse(() => ({ error }));
};

export const createHTTPResponse = (data: unknown): never => {
  throw new HTTPResponse(() => ({ data }));
};

export const mockedBaseQuery = (async (args) => {
  assert(
    typeof args === 'function',
    `Expected query to be a function, not a ${JSON.stringify(args)}`,
  );

  try {
    return {
      data: await (args as () => unknown)(),
    };
  } catch (error) {
    if (error instanceof HTTPResponse) {
      return error.toResponse();
    }

    throw error;
  }
}) as ReturnType<typeof fetchBaseQuery>;

class HTTPResponse extends Error {
  constructor(public toResponse: () => unknown) {
    super();

    Object.setPrototypeOf(this, HTTPResponse.prototype);
  }
}
