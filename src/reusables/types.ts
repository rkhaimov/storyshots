import { ActionMeta } from './actions';
import { Brand } from './brand';
import { Device as PuppeteerDevice, Viewport } from 'puppeteer';

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
  | { type: 'error'; message: string }
  | { type: 'success'; data: T };

export type ActionsOnDevice = {
  actions: ActionMeta[];
  device: Device;
};

export type ScreenshotToAccept = {
  actual: ScreenshotPath;
};

export type ScreenshotsToCompare = {
  left: ScreenshotPath;
  right: ScreenshotPath;
};

export type JournalRecord = {
  method: string;
  args: unknown[];
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

export type ScreenshotName = Brand<string, 'ScreenshotName'>;

export type ScreenshotPath = Brand<string, 'ScreenshotPath'>;

export type StoryID = Brand<string, 'StoryID'>;

export type Device = ViewPortOnlyDeviceConfig | CompleteDeviceConfig;

export type ViewPortOnlyDeviceConfig = {
  type: 'viewport-only';
  name: string;
  viewport: Viewport;
};

export type CompleteDeviceConfig = {
  type: 'complete';
  name: string;
  config: PuppeteerDevice;
};
