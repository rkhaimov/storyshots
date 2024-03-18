import { useState } from 'react';
import { ScreenshotPath } from '../../../reusables/types';
import { useDriver } from '../../driver';
import { createResult } from './createRunTestResult';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResultsByMode,
  SuccessTestResult,
  TestResult,
  TestResults,
} from './types';
import {
  DevicePresets,
  isNil,
  JournalRecord,
  PureStory,
  ScreenshotName,
  SelectedPresets,
} from '@storyshots/core';

export function useTestResults() {
  const externals = useDriver();
  const [results, setResults] = useState<TestResults>(new Map());

  return {
    results,
    run: async (
      stories: PureStory[],
      devices: DevicePresets,
      presets: SelectedPresets,
    ) => {
      setChosenAsRunning(stories);

      runSetTestResults(stories, devices, presets);
    },
    runComplete: async (
      stories: PureStory[],
      devices: DevicePresets,
      presets: SelectedPresets,
    ) => {
      setChosenAsRunning(stories);

      runCompleteSetTestResults(stories, devices, presets);
    },
    // TODO: Logic duplication
    acceptRecords: async (
      story: PureStory,
      records: JournalRecord[],
      ready: SuccessTestResult,
    ) => {
      await externals.acceptRecords(story.id, records);

      const pass: RecordsComparisonResult = { type: 'pass', actual: records };

      setResults(
        new Map(
          results.set(story.id, {
            ...ready,
            records: pass,
          }),
        ),
      );
    },
    acceptScreenshot: async (
      story: PureStory,
      name: ScreenshotName | undefined,
      device: string | undefined,
      path: ScreenshotPath,
      ready: SuccessTestResult,
    ) => {
      await externals.acceptScreenshot({ actual: path });

      const pass: ScreenshotComparisonResult = { type: 'pass', actual: path };

      function deriveScreenshotResults(
        results: ScreenshotsComparisonResultsByMode,
      ) {
        return {
          device: results.device,
          results: {
            final: name === undefined ? pass : results.results.final,
            others: results.results.others.map((other) =>
              other.name === name ? { name, result: pass } : other,
            ),
          },
        };
      }

      setResults(
        new Map(
          results.set(story.id, {
            ...ready,
            screenshots: {
              primary:
                isNil(device) ||
                ready.screenshots.primary.device.name === device
                  ? deriveScreenshotResults(ready.screenshots.primary)
                  : ready.screenshots.primary,
              additional: ready.screenshots.additional.map((additional) => {
                if (additional.device.name !== device) {
                  return additional;
                }

                return deriveScreenshotResults(additional);
              }),
            },
          }),
        ),
      );
    },
  };

  function setChosenAsRunning(stories: PureStory[]) {
    return setResults(
      stories.reduce(
        (acc, story) => acc.set(story.id, { running: true }),
        new Map(results),
      ),
    );
  }

  async function runSetTestResults(
    stories: PureStory[],
    devices: DevicePresets,
    presets: SelectedPresets,
  ) {
    for (const story of stories) {
      const resultData = await createResult(
        externals,
        story,
        devices.primary,
        presets,
      );

      if (resultData.type === 'error') {
        setResults(
          (curr) =>
            new Map(
              curr.set(story.id, {
                running: false,
                type: 'error',
                message: resultData.message,
              }),
            ),
        );

        return;
      }

      const result: TestResult = {
        running: false,
        type: 'success',
        records: resultData.data[1],
        screenshots: {
          primary: resultData.data[0],
          additional: [],
        },
      };

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }

  async function runCompleteSetTestResults(
    stories: PureStory[],
    devices: DevicePresets,
    presets: SelectedPresets,
  ) {
    for (const story of stories) {
      const resultData = await createResult(
        externals,
        story,
        devices.primary,
        presets,
      );

      if (resultData.type === 'error') {
        setResults(
          (curr) =>
            new Map(
              curr.set(story.id, {
                running: false,
                type: 'error',
                message: resultData.message,
              }),
            ),
        );

        return;
      }

      const additionalResults: ScreenshotsComparisonResultsByMode[] = [];

      for (const device of devices.additional) {
        const resultData = await createResult(
          externals,
          story,
          device,
          presets,
        );

        if (resultData.type === 'error') {
          setResults(
            (curr) =>
              new Map(
                curr.set(story.id, {
                  running: false,
                  type: 'error',
                  message: resultData.message,
                }),
              ),
          );

          return;
        }

        additionalResults.push(resultData.data[0]);
      }

      const result: TestResult = {
        running: false,
        type: 'success',
        records: resultData.data[1],
        screenshots: {
          primary: resultData.data[0],
          additional: additionalResults,
        },
      };

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}
// функция генерирующая комбинации
// [
//   {
//     device:
//     selectedPresets
//   }
// ]
