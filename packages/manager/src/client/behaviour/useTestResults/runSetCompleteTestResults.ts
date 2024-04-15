import {
  Device,
  PreviewState,
  PureStory,
  SelectedPresets,
} from '@storyshots/core';
import React from 'react';
import { IWebDriver, WithPossibleError } from '../../../reusables/types';
import { ActualResult, createActualResult } from './createActualResult';
import { TestResultDetails, TestResults } from './types';

export async function runSetCompleteTestResults(
  driver: IWebDriver,
  setResults: React.Dispatch<React.SetStateAction<TestResults>>,
  stories: PureStory[],
  preview: PreviewState,
) {
  for (const story of stories) {
    const details: WithPossibleError<TestResultDetails>[] = [];

    for (const device of preview.devices) {
      details.push(await createDetailedResult(driver, story, device, preview));
    }

    const result = toAllSuccessOrAnyError(details);

    if (result.type === 'error') {
      setResults(
        (curr) =>
          new Map(
            curr.set(story.id, {
              running: false,
              type: 'error',
              message: result.message,
            }),
          ),
      );

      continue;
    }

    setResults(
      (curr) =>
        new Map(
          curr.set(story.id, {
            running: false,
            type: 'success',
            details: result.data,
          }),
        ),
    );
  }
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

function createAllPossiblePresets(
  presets: PreviewState['presets'],
): SelectedPresets[] {
  if (presets.length === 0) {
    return [{}];
  }

  const [head, ...tail] = presets;

  const themes = [head.default, ...head.others];

  return themes.flatMap((theme) =>
    createAllPossiblePresets(tail).map((it) => ({ ...it, [head.name]: theme })),
  );
}

async function createDetailedResult(
  driver: IWebDriver,
  story: PureStory,
  device: Device,
  preview: PreviewState,
): Promise<WithPossibleError<TestResultDetails>> {
  const results: Array<
    WithPossibleError<{
      presets: SelectedPresets;
      result: ActualResult;
    }>
  > = [];

  for (const presets of createAllPossiblePresets(preview.presets)) {
    const result = await createActualResult(driver, story, {
      device,
      presets,
    });

    if (result.type === 'error') {
      results.push(result);

      continue;
    }

    results.push({
      type: 'success',
      data: {
        presets,
        result: result.data,
      },
    });
  }

  const result = toAllSuccessOrAnyError(results);

  if (result.type === 'error') {
    return result;
  }

  return {
    type: 'success',
    data: {
      device,
      records: result.data[0].result.records,
      screenshots: result.data[0].result.screenshots.map((screenshot) => ({
        name: screenshot.name,
        results: result.data.flatMap((details) =>
          details.result.screenshots
            .filter((it) => it.name === screenshot.name)
            .map((it) => ({ presets: details.presets, result: it.result })),
        ),
      })),
    },
  };
}
