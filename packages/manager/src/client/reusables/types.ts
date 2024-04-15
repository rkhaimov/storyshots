import { StoryID } from '@storyshots/core';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  TestResultDetails,
} from '../behaviour/useTestResults/types';

export type AcceptableRecord = {
  id: StoryID;
  details: TestResultDetails;
  result: Extract<RecordsComparisonResult, { type: 'fresh' | 'fail' }>;
};

export type AcceptableScreenshot = {
  details: TestResultDetails;
  result: Extract<ScreenshotComparisonResult, { type: 'fresh' | 'fail' }>;
};
