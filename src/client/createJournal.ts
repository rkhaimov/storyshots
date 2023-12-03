import { Journal } from './types';
import { JournalRecord } from '../reusables/types';

export function createJournal(): Journal {
  const records: JournalRecord[] = [];

  return {
    record:
      (method, fn) =>
      (...args) => {
        records.push({ method, args });

        return fn(...args);
      },
    read: () => records,
  };
}
