import { ComponentProps } from 'react';
import {
  AcceptableRecord,
  AcceptableScreenshot,
} from '../../../../reusables/runner/types';
import { EntryTitle } from '../EntryTitle';

export type Props = ComponentProps<typeof EntryTitle> & {
  status?: NonNullable<EntryStatus>['type'];
};

export type EntryErrorStatus = { type: 'error'; message: string };

export type EntryStatus =
  | {
      type: 'fresh' | 'fail';
      records: AcceptableRecord[];
      screenshots: AcceptableScreenshot[];
    }
  | { type: 'pass' }
  | EntryErrorStatus
  | { type: 'running' }
  | { type: 'scheduled' }
  | undefined;
