import { JournalRecord } from '@storyshots/core';

export type Journal = {
  record<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;
  read(): JournalRecord[];
};
