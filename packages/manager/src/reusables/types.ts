import {
  ActionMeta,
  Brand,
  Device,
  IntermediateNodeID,
  JournalRecord,
  ScreenshotName,
  StoryID,
  TestConfig,
} from '@storyshots/core';
import { TestResultDetails } from './runner/types';

export interface IWebDriver {
  actOnClientSide(action: ActionMeta[]): Promise<WithPossibleError<void>>;

  actOnServerSide(
    at: StoryID,
    payload: ActionsAndConfig,
  ): Promise<WithPossibleError<TestResultDetails>>;

  acceptScreenshot(screenshot: ScreenshotToAccept): Promise<void>;

  acceptRecords(at: StoryID, payload: DeviceAndRecord): Promise<void>;

  createScreenshotPath(path: ScreenshotPath): string;
}

export type DeviceAndRecord = {
  records: JournalRecord[];
  device: Device;
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

export type ActionsAndConfig = {
  actions: ActionMeta[];
  config: TestConfig;
};

export type ScreenshotToAccept = {
  actual: ScreenshotPath;
};

export type ActualServerSideResult = {
  records: JournalRecord[];
  screenshots: Screenshot[];
};

export type Screenshot = {
  name: ScreenshotName;
  path: ScreenshotPath;
};

// Represents full path to saved screenshot (either actual or expected)
export type ScreenshotPath = Brand<string, 'ScreenshotPath'>;

export type GroupID = IntermediateNodeID;

export type RunnableStoriesSuit = {
  id: StoryID;
  cases: Array<{
    device: Device;
    actions: ActionMeta[];
  }>;
};

export type CIChannel = {
  evaluate(): RunnableStoriesSuit[] | undefined;
};
