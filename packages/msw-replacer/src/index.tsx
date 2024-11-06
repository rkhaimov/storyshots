import type {
  DefaultBodyType,
  HttpResponse,
  RequestHandler,
  StrictRequest,
} from 'msw';
import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import type React from 'react';
import { useEffect, useState } from 'react';

export const MSWReplacer: React.FC<React.PropsWithChildren<Props>> = ({
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

export interface RequestHandlerMeta {
  path: string;
  method: keyof typeof http;
  handler: (info: {
    params: unknown;
    cookies: Record<string, string>;
    request: StrictRequest<DefaultBodyType>;
  }) => Promise<HttpResponse>;
}

interface Props {
  handlers: RequestHandlerMeta[];
}
