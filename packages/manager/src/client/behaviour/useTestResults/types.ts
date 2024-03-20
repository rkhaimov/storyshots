import { ScreenshotPath } from '../../../reusables/types';
import {
  Device,
  JournalRecord,
  ScreenshotName,
  SelectedPresets,
  StoryID,
} from '@storyshots/core';

export type TestConfig = {
  device: Device;
  presets: SelectedPresets;
};

export type TestResults = Map<StoryID, TestResult>;

export type SuccessTestResult = {
  running: false;
  type: 'success';
  records: RecordsComparisonResult;
  screenshots: {
    final: SingleConfigScreenshotResult[];
    others: ScreenshotGroupResult[];
  };
};

export type ScreenshotGroupResult = {
  name: ScreenshotName;
  configs: SingleConfigScreenshotResult[];
};

export type SingleConfigScreenshotResult = {
  device: Device;
  presets: SelectedPresets;
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
