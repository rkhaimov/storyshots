import { ScreenshotName } from '@storyshots/core';
import { ScreenshotComparisonResult } from '../behaviour/useTestResults/types';

export interface ScreenshotResult {
  name: ScreenshotName | undefined;
  deviceName: string;
  result: ScreenshotComparisonResult;
}
