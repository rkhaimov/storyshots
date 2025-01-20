import looksSame, { LooksSameOptions } from 'looks-same';
import { Story } from '../reusables/types';

export const COMPARE = {
  withLooksSame,
};

function withLooksSame(options: LooksSameOptions = {}): ImageComparator {
  return async (
    actual,
    expected,
    {
      payload: {
        config: {
          device: {
            config: { deviceScaleFactor },
          },
        },
      },
    },
  ) => {
    const _options: LooksSameOptions = {
      pixelRatio: deviceScaleFactor ? deviceScaleFactor : undefined,
      ...options,
    };

    return looksSame(actual, expected, _options as never);
  };
}

export type ImageComparator = (
  actual: Buffer,
  expected: Buffer,
  story: Story,
) => Promise<{ equal: boolean }>;
