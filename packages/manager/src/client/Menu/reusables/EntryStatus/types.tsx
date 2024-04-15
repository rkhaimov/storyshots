import {
  AcceptableRecord,
  AcceptableScreenshot,
} from '../../../reusables/types';

export type Props = { status?: NonNullable<EntryStatus>['type'] };

export type EntryStatus =
  | {
      type: 'fresh' | 'fail';
      records: AcceptableRecord[];
      screenshots: AcceptableScreenshot[];
    }
  | { type: 'pass' }
  | { type: 'error' }
  | undefined;
