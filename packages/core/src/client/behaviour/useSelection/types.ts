import { Device, ScreenshotName, Story, StoryTree } from '@core';
import { WithPossibleError } from '../../../reusables/types';

export type Selection =
  | {
      type: 'initializing';
    }
  | ReadySelection;

export type ReadySelection = {
  stories: StoryTree;
} & _ReadySelection;

type _ReadySelection =
  | {
      type: 'no-selection';
    }
  | {
      type: 'story';
      story: Story;
      selectedAt: number;
      state: PlayingState;
    }
  | {
      type: 'records';
      story: Story;
      device: Device;
    }
  | {
      type: 'screenshot';
      name: ScreenshotName;
      story: Story;
      device: Device;
    };

export type PlayingState =
  | { type: 'not-played' }
  | { type: 'playing' }
  | { type: 'played'; result: WithPossibleError<void> };

export type StorySelection = Extract<
  Selection,
  {
    type: 'story';
  }
>;

export type RecordsSelection = Extract<
  Selection,
  {
    type: 'records';
  }
>;

export type ScreenshotSelection = Extract<
  Selection,
  {
    type: 'screenshot';
  }
>;
