import { isNil } from '@storyshots/core';
import { ScreenshotsComparisonResultsByMode } from '../behaviour/useTestResults/types';
import { ScreenshotResult } from './types';

export function pickScreenshot(
  name: string | undefined,
  comparisonResult: ScreenshotsComparisonResultsByMode,
): ScreenshotResult | undefined {
  if (isNil(name)) {
    return {
      name: undefined,
      deviceName: comparisonResult.device.name,
      result: comparisonResult.results.final,
    };
  }

  const screenshot = comparisonResult.results.others.find(
    (it) => it.name === name,
  );

  if (isNil(screenshot)) {
    return undefined;
  }

  return {
    deviceName: comparisonResult.device.name,
    ...screenshot,
  };
}
