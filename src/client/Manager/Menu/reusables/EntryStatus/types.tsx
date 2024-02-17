export type Props = { status: EntryStatus };

export type EntryStatus =
  | { type: 'fresh' }
  | { type: 'pass' }
  | { type: 'fail' }
  | { type: 'error'; message: string }
  | null;
