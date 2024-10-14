import { PreviewState, PureStory, StoryID, TestConfig } from '@storyshots/core';
import React from 'react';
import { createActualResult } from './createActualResult';
import { TestResult, TestResults } from './types';

export function runSetConfiguredTestResults(
  setResults: React.Dispatch<React.SetStateAction<TestResults>>,
  stories: PureStory[],
  config: TestConfig,
  preview: PreviewState,
) {
  const tasks = stories.map(async (story) => {
    const result = await toStoryResult(story, config, preview);

    setResults((curr) => new Map(curr.set(result[0], result[1])));
  });

  return Promise.all(tasks);
}

async function toStoryResult(
  story: PureStory,
  config: TestConfig,
  preview: PreviewState,
): Promise<[StoryID, TestResult]> {
  const results = await createActualResult(story, config, preview);

  if (results.type === 'error') {
    return [
      story.id,
      {
        running: false,
        type: 'error',
        message: results.message,
      },
    ];
  }

  return [
    story.id,
    {
      running: false,
      type: 'success',
      details: [
        {
          device: config.device,
          ...results.data,
        },
      ],
    },
  ];
}
