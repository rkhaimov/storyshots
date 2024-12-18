import { StoryID } from '@storyshots/core';
import { RunnableStoriesSuit } from '../types';
import { createTestResult } from './createTestResult';
import { TestResult } from './types';

export function run(
  stories: RunnableStoriesSuit[],
  onResult: (id: StoryID, result: TestResult) => void,
) {
  for (const story of stories) {
    onResult(story.id, { running: true });
  }

  const running = stories.map((story) =>
    createTestResult(story).then((result) => onResult(story.id, result)),
  );

  return Promise.all(running);
}
