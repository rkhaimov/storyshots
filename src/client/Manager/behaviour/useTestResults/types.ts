import {
  JournalRecord,
  ScreenshotName,
  ScreenshotPath,
  StoryID,
} from '../../../../reusables/types';

export type TestResults = Map<StoryID, TestResult>;

export type ReadyTestResult = {
  running: false;
  records: RecordsComparisonResult;
  screenshots: ScreenshotsComparisonResults;
};

export type TestResult =
  | {
      running: true;
    }
  | ReadyTestResult;

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
