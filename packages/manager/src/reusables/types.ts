import {
  ActionMeta,
  Brand,
  IntermediateNodeID,
  JournalRecord,
  ScreenshotName,
  StoryID,
} from '@storyshots/core';
import { TestConfig } from '../client/behaviour/useTestResults/types';

export interface IWebDriver {
  actOnClientSide(action: ActionMeta[]): Promise<WithPossibleError<void>>;

  actOnServerSide(
    at: StoryID,
    payload: ActionsOnDevice,
  ): Promise<WithPossibleError<ActualServerSideResult>>;

  getExpectedScreenshots(
    at: StoryID,
    payload: ActionsOnDevice,
  ): Promise<ExpectedScreenshots>;

  getExpectedRecords(at: StoryID): Promise<JournalRecord[] | null>;

  acceptScreenshot(screenshot: ScreenshotToAccept): Promise<void>;

  acceptRecords(at: StoryID, records: JournalRecord[]): Promise<void>;

  areScreenshotsEqual(screenshots: ScreenshotsToCompare): Promise<boolean>;

  createScreenshotPath(path: ScreenshotPath): string;
}

export type WithPossibleError<T> =
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'success';
      data: T;
    };

export type ActionsOnDevice = {
  actions: ActionMeta[];
  config: TestConfig;
};

export type ScreenshotToAccept = {
  actual: ScreenshotPath;
};

export type ScreenshotsToCompare = {
  left: ScreenshotPath;
  right: ScreenshotPath;
};

export type ActualServerSideResult = {
  records: JournalRecord[];
  screenshots: ActualScreenshots;
};

export type ActualScreenshots = {
  final: ScreenshotPath;
  others: Screenshot[];
};

export type ExpectedScreenshots = {
  final: ScreenshotPath | undefined;
  others: Screenshot[];
};

export type Screenshot = {
  name: ScreenshotName;
  path: ScreenshotPath;
};

// Represents full path to saved screenshot (either actual or expected)
export type ScreenshotPath = Brand<string, 'ScreenshotPath'>;

export type GroupID = IntermediateNodeID;
