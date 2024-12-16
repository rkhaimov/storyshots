import React, { useMemo } from 'react';
import { APIType } from './types';

export const ReplaceRtkAPI: React.FC<
  React.PropsWithChildren<{
    endpoints: Record<string, (input: never) => unknown>;
    api: APIType;
  }>
> = ({ endpoints, api, children }) => {
  useMemo(() => {
    api.enhanceEndpoints({
      endpoints: Object.fromEntries(
        Object.entries(endpoints).map(([method, impl]) => [
          method,
          { query: (arg: never) => () => impl(arg) },
        ]),
      ),
    } as never);
  }, []);

  return children;
};
