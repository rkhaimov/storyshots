import { DeviceName, ScreenshotName, StoryID } from '@storyshots/core';

export type UntrustedSelection = {
  config: UntrustedPreviewConfig;
} & _UntrustedSelection;

type _UntrustedSelection =
  | {
      type: 'no-selection';
    }
  | { type: 'story'; id: StoryID; selectedAt: number }
  | {
      type: 'records';
      id: StoryID;
      device: DeviceName;
    }
  | {
      type: 'screenshot';
      id: StoryID;
      name: ScreenshotName;
      device: DeviceName;
    };

export type UntrustedPreviewConfig = {
  device?: DeviceName;
  emulated: boolean;
};
