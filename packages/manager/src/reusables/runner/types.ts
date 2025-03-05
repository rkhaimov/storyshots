import { Device, JournalRecord, ScreenshotName } from '@storyshots/core';
import { ScreenshotPath, WithPossibleError } from '../types';

export type DeviceToTestRunState = Map<Device, TestRunState>;

export type TestRunState = TestScheduled | TestRunning | TestDone;

export type TestScheduled = {
  type: 'scheduled';
};

export type TestRunning = {
  type: 'running';
};

export type TestDone = {
  type: 'done';
  details: WithPossibleError<TestRunResult>;
};

export type TestRunResult = {
  records: RecordsComparisonResult;
  screenshots: ScreenshotComparisonResult[];
};

export type ScreenshotComparisonResult =
  | {
      type: 'fresh';
      actual: ScreenshotPath;
      name: ScreenshotName;
    }
  | {
      type: 'fail';
      actual: ScreenshotPath;
      expected: ScreenshotPath;
      name: ScreenshotName;
    }
  | { type: 'pass'; actual: ScreenshotPath; name: ScreenshotName };

export type AcceptableScreenshot = Extract<
  ScreenshotComparisonResult,
  { type: 'fresh' | 'fail' }
>;

export type AcceptableRecords = Extract<
  RecordsComparisonResult,
  { type: 'fresh' | 'fail' }
>;

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
