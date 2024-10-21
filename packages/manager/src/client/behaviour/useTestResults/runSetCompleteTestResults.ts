import { PreviewState, PureStory, StoryID, TestConfig } from '@storyshots/core';
import React from 'react';
import { WithPossibleError } from '../../../reusables/types';
import { createActualResult } from './createActualResult';
import { TestResult, TestResultDetails, TestResults } from './types';

export async function runSetCompleteTestResults(
  setResults: React.Dispatch<React.SetStateAction<TestResults>>,
  stories: PureStory[],
  preview: PreviewState,
) {
  const tasks = stories.map(async (story) => {
    const result = await toStoryResult(story, preview);

    setResults((curr) => new Map(curr.set(result[0], result[1])));
  });

  return Promise.all(tasks);
}

async function toStoryResult(
  story: PureStory,
  preview: PreviewState,
): Promise<[StoryID, TestResult]> {
  const details: WithPossibleError<TestResultDetails>[] = [];

  for (const device of preview.devices) {
    details.push(await createDetailedResult(story, { device }, preview));
  }

  const result = toAllSuccessOrAnyError(details);

  if (result.type === 'error') {
    return [
      story.id,
      {
        running: false,
        type: 'error',
        message: result.message,
      },
    ];
  }

  return [
    story.id,
    {
      running: false,
      type: 'success',
      details: result.data,
    },
  ];
}

function toAllSuccessOrAnyError<T>(
  results: WithPossibleError<T>[],
): WithPossibleError<T[]> {
  const result: WithPossibleError<T[]> = {
    type: 'success',
    data: [],
  };

  for (const it of results) {
    if (it.type === 'error') {
      return it;
    }

    result.data.push(it.data);
  }

  return result;
}

async function createDetailedResult(
  story: PureStory,
  config: TestConfig,
  preview: PreviewState,
): Promise<WithPossibleError<TestResultDetails>> {
  const result = await createActualResult(story, config, preview);

  if (result.type === 'error') {
    return result;
  }

  return {
    type: 'success',
    data: {
      device: config.device,
      ...result.data,
    },
  };
}
