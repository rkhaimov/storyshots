import {
  Device,
  DevicePresets,
  isNil,
  JournalRecord,
  PurePresetGroup,
  PureStory,
  ScreenshotName,
  SelectedPresets,
} from '@storyshots/core';
import { useState } from 'react';
import { ScreenshotPath, WithPossibleError } from '../../../reusables/types';
import { useDriver } from '../../driver';
import { ActualResult, createActualResult } from './createRunTestResult';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotGroupResult,
  SingleConfigScreenshotResult,
  SuccessTestResult,
  TestConfig,
  TestResult,
  TestResults,
} from './types';

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

      runSetPrimaryTestResults(stories, devices, presets);
    },
    runComplete: async (
      stories: PureStory[],
      devices: DevicePresets,
      presets: PurePresetGroup[],
    ) => {
      setChosenAsRunning(stories);

      runSetCompleteTestResults(stories, devices, presets);
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
      path: ScreenshotPath,
      ready: SuccessTestResult,
    ) => {
      await externals.acceptScreenshot({ actual: path });

      const pass: ScreenshotComparisonResult = { type: 'pass', actual: path };

      function deriveScreenshotResults(
        result: SingleConfigScreenshotResult[],
      ): SingleConfigScreenshotResult[] {
        return result.map((config) =>
          config.result.actual === path
            ? {
                ...config,
                result: pass,
              }
            : config,
        );
      }

      const newResults: SuccessTestResult = {
        ...ready,
        screenshots: {
          final: isNil(name)
            ? deriveScreenshotResults(ready.screenshots.final)
            : ready.screenshots.final,
          others: ready.screenshots.others.map((screenshotResult) =>
            screenshotResult.name === name
              ? {
                  ...screenshotResult,
                  results: deriveScreenshotResults(screenshotResult.results),
                }
              : screenshotResult,
          ),
        },
      };

      setResults(new Map(results.set(story.id, newResults)));
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

  async function runSetPrimaryTestResults(
    stories: PureStory[],
    devices: DevicePresets,
    presets: SelectedPresets,
  ) {
    for (const story of stories) {
      const config: TestConfig = {
        device: devices.primary,
        presets,
      };

      const results = await createActualResult(externals, story, config);

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
        records,
        screenshots: {
          final: [
            {
              config,
              result: screenshots.final,
            },
          ],
          others: screenshots.others.map((it) => ({
            name: it.name,
            results: [
              {
                config,
                result: it.result,
              },
            ],
          })),
        },
      };

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }

  async function runSetCompleteTestResults(
    stories: PureStory[],
    devices: DevicePresets,
    presets: PurePresetGroup[],
  ) {
    const configs = createAllPossibleConfigs(devices, presets);

    for (const story of stories) {
      const results: WithPossibleError<ActualResult>[] = [];

      for (const config of configs) {
        results.push(await createActualResult(externals, story, config));
      }

      const result = toAllSuccessOrAnyError(results);

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
              records: result.data[0].records,
              screenshots: toTestResults(result.data),
            }),
          ),
      );
    }
  }
}

function toTestResults(
  results: ActualResult[],
): SuccessTestResult['screenshots'] {
  return {
    final: results.map((it) => ({
      config: it.config,
      result: it.screenshots.final,
    })),
    others: groupByName(
      results.flatMap((it) =>
        it.screenshots.others.map(
          (other): ScreenshotGroupResult => ({
            name: other.name,
            results: [{ config: it.config, result: other.result }],
          }),
        ),
      ),
    ),
  };
}

function groupByName(
  screenshots: ScreenshotGroupResult[],
): ScreenshotGroupResult[] {
  const grouped = screenshots.reduce(
    (all, screenshot) => {
      all[screenshot.name] = [...(all[screenshot.name] ?? []), screenshot];

      return all;
    },
    {} as Record<ScreenshotName, ScreenshotGroupResult[]>,
  );

  return Object.entries(grouped).map(([name, results]) => ({
    name: name as ScreenshotName,
    results: results.flatMap((it) => it.results),
  }));
}

function toAllSuccessOrAnyError(
  results: WithPossibleError<ActualResult>[],
): WithPossibleError<ActualResult[]> {
  const result: WithPossibleError<ActualResult[]> = {
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

function createAllPossibleConfigs(
  devices: DevicePresets,
  presets: PurePresetGroup[],
): TestConfig[] {
  const initialConfigs: TestConfig[] = toFlatDevices(devices).map((device) => ({
    device,
    presets: {},
  }));

  return presets.reduce<TestConfig[]>((configs, presetGroup) => {
    return toFlatPresets(presetGroup).flatMap((preset) => {
      return configs.map((config) => ({
        ...config,
        presets: {
          ...config.presets,
          [presetGroup.name]: preset,
        },
      }));
    });
  }, initialConfigs);
}

function toFlatDevices(devices: DevicePresets): Device[] {
  return [devices.primary, ...devices.additional];
}

function toFlatPresets(presets: PurePresetGroup): string[] {
  return [presets.default, ...presets.additional];
}
