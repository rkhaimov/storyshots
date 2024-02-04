import { ActionMeta } from './actions';
import { Brand } from './brand';
import { Device, Viewport } from 'puppeteer';

export interface IWebDriver {
  actOnClientSide(action: ActionMeta[]): Promise<WithPossibleError<void>>;

  actOnServerSide(
    at: StoryID,
    payload: ActionsAndMode,
  ): Promise<WithPossibleError<ActualServerSideResult>>;

  getExpectedScreenshots(
    at: StoryID,
    payload: ActionsAndMode,
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

export type ActionsAndMode = {
  actions: ActionMeta[];
  mode: PageMode;
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

export type PageMode = SpecificViewPort | SpecificDevice;

type SpecificViewPort = {
  type: 'viewport';
  id: string;
  viewport: Viewport;
};

type SpecificDevice = {
  type: 'device';
  id: string;
  device: Device;
};
