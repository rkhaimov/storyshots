import { ActionMeta } from './actions';
import { Brand } from './brand';

export interface IWebDriver {
  actOnClientSide(action: ActionMeta[]): Promise<void>;

  actOnServerSide(
    at: StoryID,
    actions: ActionMeta[],
  ): Promise<ActualServerSideResult>;

  getExpectedScreenshots(
    at: StoryID,
    actions: ActionMeta[],
  ): Promise<ExpectedScreenshots>;

  getExpectedRecords(at: StoryID): Promise<JournalRecord[] | null>;

  acceptScreenshot(screenshot: ScreenshotToAccept): Promise<void>;

  acceptRecords(at: StoryID, records: JournalRecord[]): Promise<void>;

  areScreenshotsEqual(screenshots: ScreenshotsToCompare): Promise<boolean>;

  createScreenshotPath(path: ScreenshotPath): string;
}

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
