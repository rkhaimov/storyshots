import { isNil } from '@storyshots/core';
import { Screenshot } from '../../../../reusables/types';
import { BasePayload } from '../types';

export async function findExpectedScreenshots({
  story,
  baseline,
}: BasePayload) {
  const screenshots: Screenshot[] = [];
  for (const action of story.payload.actions) {
    if (action.action !== 'screenshot') {
      continue;
    }

    const path = await baseline.getExpectedScreenshot(
      story,
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
