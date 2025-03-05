import { CreateExternalsFactory } from '../../reusables/preview/externals';

export function rw(): CreateExternalsFactory<ReadWriteExternals> {
  return () => ({
    createExternals: () => ({
      read: () => 'User',
      write: () => {},
    }),
    createJournalExternals: (externals, config) => ({
      ...externals,
      write: config.journal.asRecordable('write', externals.write),
    }),
  });
}

export type ReadWriteExternals = {
  read(): string;
  write(name: string): void;
};
