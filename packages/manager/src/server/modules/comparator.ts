import { StoryID } from '@storyshots/core';
import { ActionsAndConfig } from '../../reusables/types';
import looksSame, { LooksSameOptions } from 'looks-same';

export const COMPARATOR = {
  withLooksSame,
};

function withLooksSame(
  options: LooksSameOptions = {},
): ImageComparator {
  return async (actual, expected, story) => {
    const _options: LooksSameOptions = {
      pixelRatio: story.meta.config.device.config.deviceScaleFactor
        ? story.meta.config.device.config.deviceScaleFactor
        : undefined,
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

type Story = {
  id: StoryID;
  meta: ActionsAndConfig;
};
