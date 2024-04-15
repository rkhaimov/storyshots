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

export interface IWebDriver {
  actOnClientSide(action: ActionMeta[]): Promise<WithPossibleError<void>>;

  actOnServerSide(
    at: StoryID,
    payload: ActionsAndConfig,
  ): Promise<WithPossibleError<ActualServerSideResult>>;

  getExpectedScreenshots(
    at: StoryID,
    payload: ActionsAndConfig,
  ): Promise<Screenshot[]>;

  getExpectedRecords(
    at: StoryID,
    device: Device,
  ): Promise<JournalRecord[] | null>;

  acceptScreenshot(screenshot: ScreenshotToAccept): Promise<void>;

  acceptRecords(at: StoryID, payload: DeviceAndRecord): Promise<void>;

  areScreenshotsEqual(screenshots: ScreenshotsToCompare): Promise<boolean>;

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

export type ScreenshotsToCompare = {
  left: ScreenshotPath;
  right: ScreenshotPath;
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
