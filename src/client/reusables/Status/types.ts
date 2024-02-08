import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
} from '../../Manager/behaviour/useTestResults/types';

export type RecordsOrScreenshotComparisonResultType =
  | RecordsComparisonResult['type']
  | ScreenshotComparisonResult['type'];

export type StatusType = RecordsOrScreenshotComparisonResultType | 'error' | null;
