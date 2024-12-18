import { isNil, StoryID } from '@storyshots/core';
import { ActionsAndConfig, Screenshot } from '../../reusables/types';
import { Baseline } from '../reusables/baseline';

export async function findExpectedScreenshots(
  baseline: Baseline,
  id: StoryID,
  { actions, config }: ActionsAndConfig,
) {
  const screenshots: Screenshot[] = [];
  for (const action of actions) {
    if (action.action !== 'screenshot') {
      continue;
    }

    const path = await baseline.getExpectedScreenshot(
      id,
      config,
      action.payload.name,
    );

    if (isNil(path)) {
      continue;
    }

    screenshots.push({
      name: action.payload.name,
      path: path,
    });
  }

  return screenshots;
}
