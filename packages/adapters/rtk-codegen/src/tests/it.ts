import { setupServer, SetupServerApi } from 'msw/node';
import { toMatchSnapshot } from './toMatchSnapshot';

export async function it(
  message: string,
  operation: (utils: ItUtils) => Promise<void>,
) {
  console.log('it', message);

  using interceptor = createFetchInterceptor();

  const records: Record<string, unknown> = {};

  await operation({
    interceptor,
    toMatchSnapshot: (label, data) => (records[label] = data),
  });

  toMatchSnapshot(message, records);
}

export type FetchInterceptor = Disposable & {
  handle: SetupServerApi['resetHandlers'];
};

function createFetchInterceptor(): FetchInterceptor {
  const server = setupServer();

  server.listen();

  return {
    handle: (...handlers) => server.resetHandlers(...handlers),
    [Symbol.dispose]: () => server.close(),
  };
}

export type ItUtils = {
  interceptor: FetchInterceptor;
  toMatchSnapshot: (label: string, data: unknown) => void;
};
