import {
  ActionMeta,
  Brand,
  Device,
  JournalRecord,
  PureStoryTree,
  ScreenshotName,
  StoryID,
} from '@storyshots/core';
import { AcceptableRecords, AcceptableScreenshot, TestRunResult } from './runner/types';

export interface IWebDriver {
  play(actions: ActionMeta[]): Promise<WithPossibleError<void>>;

  test(
    at: StoryID,
    meta: DeviceAndActions,
  ): Promise<WithPossibleError<TestRunResult>>;

  acceptScreenshot(screenshot: AcceptableScreenshot): Promise<void>;

  acceptRecords(record: DeviceAndAcceptableRecords): Promise<void>;

  createImgSrc(path: ScreenshotPath): string;
}

export type DeviceAndAcceptableRecords = {
  id: StoryID;
  device: Device;
  records: AcceptableRecords;
};

export type WithPossibleError<T> =
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'success';
      data: T;
    };

export type DeviceAndActions = {
  actions: ActionMeta[];
  device: Device;
};

export type Screenshot = {
  name: ScreenshotName;
  path: ScreenshotPath;
};

// Represents full path to saved screenshot (either actual or expected)
export type ScreenshotPath = Brand<string, 'ScreenshotPath'>;

declare global {
  interface Window {
    getStories(): PureStoryTree[] | undefined;
  }
}
