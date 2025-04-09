import { isNil } from '@lib';
import { http, HttpResponse, RequestHandler } from 'msw';
import { setupWorker } from 'msw/browser';
import React, { useEffect, useState } from 'react';
import { EndpointArgs, Endpoints, UnknownEndpoint } from './types';
import { native } from './utils';

type Props = {
  endpoints: Endpoints;
};

export const MSWReplacer: React.FC<React.PropsWithChildren<Props>> = ({
  endpoints,
  children,
}) => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    void setupWorker(
      ...toRequestHandlers(endpoints as UnknownEndpoints),
      createUnknownEndpointsFallback(),
    )
      .start()
      .then(() => setInitializing(false));
  }, []);

  if (initializing) {
    return null;
  }

  return children;
};

function toRequestHandlers(endpoints: UnknownEndpoints): RequestHandler[] {
  return Object.values(endpoints).map((endpoint) =>
    http[toHTTPMethod(endpoint.method)](
      endpoint.url,
      toMSWResolver(endpoint.handle),
    ),
  );
}

function createUnknownEndpointsFallback() {
  const MATCH_NON_FILE_URL_ONLY = /^(?!.*\/[^/]+\.[^/]+(\?.*)?$).*/;

  return http.all(
    MATCH_NON_FILE_URL_ONLY,
    toMSWResolver(() => native(new HttpResponse(null, { status: 404 }))),
  );
}

function toMSWResolver(handle: UnknownEndpoint['handle']) {
  return async (info: EndpointArgs): Promise<HttpResponse> => {
    try {
      const response = await handle(info);

      return HttpResponse.json(response as never);
    } catch (e) {
      if (e instanceof HttpResponse) {
        return e;
      }

      throw e;
    }
  };
}

function toHTTPMethod(method: UnknownEndpoint['method']): keyof typeof http {
  if (isNil(method)) {
    return 'get';
  }

  return method.toLowerCase() as never;
}

type UnknownEndpoints = Record<string, UnknownEndpoint>;
