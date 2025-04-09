import { createPreviewApp } from '@storyshots/react';
import { Endpoints } from '@storyshots/msw-externals';

export const { run, it, describe } = createPreviewApp({
  createExternals: () => ({}) as Endpoints,
  createJournalExternals: (externals) => externals,
});
