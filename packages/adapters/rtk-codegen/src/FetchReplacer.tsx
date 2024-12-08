import type { RequestHandler } from 'msw';
import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import type React from 'react';
import { useEffect, useState } from 'react';
import { RequestHandlerMeta } from './types';

interface Props {
  handlers: RequestHandlerMeta[];
}

export const FetchReplacer: React.FC<React.PropsWithChildren<Props>> = ({
  handlers,
  children,
}) => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const worker = setupWorker(...handlers.map(toRequestHandler));

    void worker.start().then(() => setInitializing(false));
  }, []);

  if (initializing) {
    return null;
  }

  return children;
};

function toRequestHandler(meta: RequestHandlerMeta): RequestHandler {
  return http[meta.method](meta.path, meta.handler);
}
