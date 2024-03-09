import { JournalRecord } from '@storyshots/core';
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
