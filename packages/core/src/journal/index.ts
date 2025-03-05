import { Journal, JournalRecord } from './types';

export function createJournal(): Journal {
  const records: JournalRecord[] = [];

  const journal: Journal = {
    record: (method, ...args) => {
      records.push({ method, args });
    },
    asRecordable:
      (method, fn) =>
      (...args) => {
        journal.record(method, ...args);

        return fn(...args);
      },
    __read: () => records,
  };

  return journal;
}
