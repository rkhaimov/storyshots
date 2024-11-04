export type Journal = {
  record(method: string, ...args: unknown[]): void;
  asRecordable<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;
  read(): JournalRecord[];
};

export type JournalRecord = {
  method: string;
  args: unknown[];
};
