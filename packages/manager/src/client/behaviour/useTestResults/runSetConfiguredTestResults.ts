import { PreviewState, PureStory, StoryID, TestConfig } from '@storyshots/core';
import React from 'react';
import { IWebDriver } from '../../../reusables/types';
import { createActualResult } from './createActualResult';
import { TestResult, TestResults } from './types';

export function runSetConfiguredTestResults(
  driver: IWebDriver,
  setResults: React.Dispatch<React.SetStateAction<TestResults>>,
  stories: PureStory[],
  config: TestConfig,
  preview: PreviewState,
) {
  const tasks = stories.map(async (story) => {
    const result = await toStoryResult(story, driver, config, preview);

    setResults((curr) => new Map(curr.set(result[0], result[1])));
  });

  return Promise.all(tasks);
}

async function toStoryResult(
  story: PureStory,
  driver: IWebDriver,
  config: TestConfig,
  preview: PreviewState,
): Promise<[StoryID, TestResult]> {
  const results = await createActualResult(driver, story, config, preview);

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

  const { screenshots, records } = results.data;

  return [
    story.id,
    {
      running: false,
      type: 'success',
      details: [
        {
          device: config.device,
          records,
          screenshots: screenshots.map((it) => ({
            name: it.name,
            results: [{ presets: config.presets, result: it.result }],
          })),
        },
      ],
    },
  ];
}
