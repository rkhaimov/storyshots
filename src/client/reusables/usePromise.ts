import { useEffect, useState } from 'react';

export function usePromise<T>(
  createPromise: () => Promise<T>,
  dependencies: unknown[],
) {
  const [response, setResponse] = useState<AsyncSnapshot<T>>({
    type: 'waiting',
  });

  // TODO: Cancellation must be tested
  useEffect(() => {
    createPromise().then((data) =>
      setResponse({
        type: 'done',
        data,
      }),
    );
  }, dependencies);

  return response;
}

export type AsyncSnapshot<T> = { type: 'waiting' } | { type: 'done'; data: T };
