import { ScreenshotName, SelectedPresets, isNil } from '@storyshots/core';
import {
  SingleConfigScreenshotResult,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';

export function pickScreenshots(
  name: ScreenshotName | undefined,
  result: SuccessTestResult,
): SingleConfigScreenshotResult[] | undefined {
  if (isNil(name)) {
    return result.screenshots.final;
  }

  return result.screenshots.others.find((group) => group.name === name)
    ?.configs;
}

export function presetsToString(presets: SelectedPresets) {
  return presets
    ? Object.entries(presets)
        .map((pair) => pair.join(': '))
        .join(' - ')
    : '';
}
