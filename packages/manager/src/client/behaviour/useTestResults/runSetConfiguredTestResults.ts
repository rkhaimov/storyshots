import { PureStory, TestConfig } from '@storyshots/core';
import React from 'react';
import { IWebDriver } from '../../../reusables/types';
import { createActualResult } from './createActualResult';
import { TestResult, TestResults } from './types';

export async function runSetConfiguredTestResults(
  driver: IWebDriver,
  setResults: React.Dispatch<React.SetStateAction<TestResults>>,
  stories: PureStory[],
  config: TestConfig,
) {
  for (const story of stories) {
    const results = await createActualResult(driver, story, config);

    if (results.type === 'error') {
      setResults(
        (curr) =>
          new Map(
            curr.set(story.id, {
              running: false,
              type: 'error',
              message: results.message,
            }),
          ),
      );

      continue;
    }

    const { screenshots, records } = results.data;

    const result: TestResult = {
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
    };

    setResults((curr) => new Map(curr.set(story.id, result)));
  }
}
