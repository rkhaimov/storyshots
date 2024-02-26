import { JournalRecord } from '../../../reusables/journal';
import { Journal } from './types';

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
