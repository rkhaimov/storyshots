import {
  JournalRecord,
  Device,
  ScreenshotName,
  ScreenshotPath,
  StoryID,
} from '../../../../reusables/types';

export type TestResults = Map<StoryID, TestResult>;

export type SuccessTestResult = {
  running: false;
  type: 'success';
  records: RecordsComparisonResult;
  screenshots: {
    primary: ScreenshotsComparisonResultsByMode;
    additional: ScreenshotsComparisonResultsByMode[];
  };
};

export type ScreenshotsComparisonResultsByMode = {
  device: Device;
  results: ScreenshotsComparisonResults;
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

export type ScreenshotsComparisonResults = {
  final: ScreenshotComparisonResult;
  others: Array<{
    name: ScreenshotName;
    result: ScreenshotComparisonResult;
  }>;
};

export type ScreenshotComparisonResult =
  | {
      type: 'fresh';
      actual: ScreenshotPath;
    }
  | { type: 'pass'; actual: ScreenshotPath }
  | {
      type: 'fail';
      actual: ScreenshotPath;
      expected: ScreenshotPath;
    };

export type RecordsComparisonResult =
  | {
      type: 'fresh';
      actual: JournalRecord[];
    }
  | {
      type: 'pass';
      actual: JournalRecord[];
    }
  | {
      type: 'fail';
      actual: JournalRecord[];
      expected: JournalRecord[];
    };
