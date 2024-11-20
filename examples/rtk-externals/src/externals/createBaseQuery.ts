import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockedBaseQuery } from '@storyshots/rtk-externals';

export function createBaseQuery() {
  return process.env.TESTING
    ? mockedBaseQuery
    : fetchBaseQuery({ baseUrl: '/api' });
}
