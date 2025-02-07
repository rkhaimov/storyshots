import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export function createBaseQuery() {
  return fetchBaseQuery({ baseUrl: '/api' });
}
