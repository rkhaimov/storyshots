import { Device, PureStoryTree, StoryID } from '@storyshots/core';
import { DeviceToTestRunState } from '../types';

export type RunConfig = {
  on: Device[];
  stories: PureStoryTree[];
  abort: AbortSignal;
  size: number;
  onResult(id: StoryID, result: DeviceToTestRunState): void;
};
