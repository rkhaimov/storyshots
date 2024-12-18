import {
  Device,
  JournalRecord,
  ScreenshotName,
  StoryID,
} from '@storyshots/core';
import { ScreenshotPath } from '../types';

export type SuccessTestResult = {
  running: false;
  type: 'success';
  details: TestResultDetails[];
};

export type TestResultDetails = {
  device: Device;
  records: RecordsComparisonResult;
  screenshots: ScreenshotResult[];
};

export type ScreenshotResult = {
  name: ScreenshotName;
  result: ScreenshotComparisonResult;
};

export type ErrorTestResult = {
  running: false;
  type: 'error';
  message: string;
};

export type TestResult =
  | {
      running: true;
    }
  | SuccessTestResult
  | ErrorTestResult;

export type ScreenshotsComparisonResult = {
  name: ScreenshotName;
  result: ScreenshotComparisonResult;
};

export type ScreenshotComparisonResult =
  | {
      type: 'fresh';
      actual: ScreenshotPath;
    }
  | {
      type: 'fail';
      actual: ScreenshotPath;
      expected: ScreenshotPath;
    }
  | { type: 'pass'; actual: ScreenshotPath };

export type RecordsComparisonResult =
  | {
      type: 'fresh';
      actual: JournalRecord[];
    }
  | {
      type: 'fail';
      actual: JournalRecord[];
      expected: JournalRecord[];
    }
  | {
      type: 'pass';
      actual: JournalRecord[];
    };

export type AcceptableRecord = {
  id: StoryID;
  details: TestResultDetails;
  result: Extract<RecordsComparisonResult, { type: 'fresh' | 'fail' }>;
};

export type AcceptableScreenshot = {
  details: TestResultDetails;
  result: Extract<ScreenshotComparisonResult, { type: 'fresh' | 'fail' }>;
};
