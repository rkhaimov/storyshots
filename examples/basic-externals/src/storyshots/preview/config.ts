import { createPreviewApp } from '@storyshots/react';
import {
  createJournalExternals,
  createMockExternals,
} from '../externals/createMockExternals';

export const { run, it, describe } = createPreviewApp({
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});
