import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from './createBaseQuery';

export const api = createApi({
  baseQuery: createBaseQuery(),
  endpoints: () => ({}),
});
