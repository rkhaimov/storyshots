import {
  Device,
  PreviewState,
  PureStory,
  ScreenshotName,
} from '@storyshots/core';
import { WithPossibleError } from '../../../reusables/types';

export type Selection =
  | {
      type: 'initializing';
    }
  | ReadySelection;

export type ReadySelection = PreviewState & _ReadySelection;

type _ReadySelection =
  | {
      type: 'no-selection';
    }
  | {
      type: 'story';
      story: PureStory;
      selectedAt: number;
      state: PlayingState;
    }
  | {
      type: 'records';
      story: PureStory;
      device: Device;
    }
  | {
      type: 'screenshot';
      name: ScreenshotName;
      story: PureStory;
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
