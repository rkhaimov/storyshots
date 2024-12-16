import { createActor, PureStory, TestConfig } from '@storyshots/core';
import { RunnableStoriesSuit } from '../types';

export function createRunnableStoriesSuits(
  stories: PureStory[],
  config: TestConfig[],
): RunnableStoriesSuit[] {
  return stories.map((story) => ({
    id: story.id,
    cases: config.map(({ device }) => ({
      device,
      actions: story.payload
        .act(createActor(), { device, screenshotting: true })
        .toMeta(),
    })),
  }));
}
