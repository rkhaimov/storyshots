import { ExternalsFactory } from '@storyshots/react-preview/src/types';

export function createDefaultExternalsFactory(): CreateExternalsFactory<unknown> {
  return () => ({
    createExternals: () => {},
    createJournalExternals: () => {},
  });
}

export type CreateExternalsFactory<T> = () => ExternalsFactory<T>;
