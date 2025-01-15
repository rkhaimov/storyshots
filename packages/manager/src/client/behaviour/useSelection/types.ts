import {
  Device,
  DeviceName,
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

export type ReadySelection = PreviewConfig & _ReadySelection;

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
      device: DeviceName;
    }
  | {
      type: 'screenshot';
      name: ScreenshotName;
      story: PureStory;
      device: DeviceName;
    };

export type PlayingState =
  | { type: 'not-played' }
  | { type: 'playing' }
  | { type: 'played'; result: WithPossibleError<void> };

export type PreviewConfig = {
  preview: PreviewState;
  config: {
    device: Device;
    emulated: boolean;
  };
};

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
