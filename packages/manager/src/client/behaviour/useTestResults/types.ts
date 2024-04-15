import {
  Device,
  JournalRecord,
  ScreenshotName,
  SelectedPresets,
  StoryID,
} from '@storyshots/core';
import { ScreenshotPath } from '../../../reusables/types';

export type TestResults = Map<StoryID, TestResult>;

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
  results: PresetScreenshotResult[];
};

export type PresetScreenshotResult = {
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
