import looksSame, { LooksSameOptions } from 'looks-same';
import { Story } from '../reusables/types';

export const COMPARE = {
  withLooksSame,
};

function withLooksSame(options: LooksSameOptions = {}): ImageComparator {
  return async (actual, expected) =>
    looksSame(actual, expected, options as never);
}

export type ImageComparator = (
  actual: Buffer,
  expected: Buffer,
  story: Story,
) => Promise<{ equal: boolean }>;
