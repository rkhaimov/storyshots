import { isNil } from '@storyshots/core';
import { Screenshot } from '../../../../reusables/types';
import { BasePayload } from '../types';

export async function findExpectedScreenshots({
  story: {
    id,
    payload: { actions, config },
  },
  baseline,
}: BasePayload) {
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
