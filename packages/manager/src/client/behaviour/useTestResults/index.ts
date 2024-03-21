import { useState } from 'react';
import {
  PossibleError,
  PossibleSuccess,
  ScreenshotPath,
  WithPossibleError,
} from '../../../reusables/types';
import { useDriver } from '../../driver';
import { ActualResult, createResult } from './createRunTestResult';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  SingleConfigScreenshotResult,
  SuccessTestResult,
  TestConfig,
  TestResult,
  TestResults,
} from './types';
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
                  configs: deriveScreenshotResults(screenshotResult.configs),
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
      const results = await createResult(externals, story, {
        device: devices.primary,
        presets,
      });

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
              device: devices.primary,
              presets,
              result: screenshots.final,
            },
          ],
          others: screenshots.others.map((it) => ({
            name: it.name,
            configs: [
              {
                device: devices.primary,
                presets,
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
    const allConfigs = generateConfigs(devices, presets);

    for (const story of stories) {
      const results: WithPossibleError<ActualResult>[] = [];

      for (const config of allConfigs) {
        results.push(await createResult(externals, story, config));
      }

      const failedResults = results.filter(
        (it): it is PossibleError => it.type === 'error',
      );

      if (failedResults.length > 0) {
        return failedResults[0];
      }

      const successResults = results
        .filter(
          (it): it is PossibleSuccess<ActualResult> => it.type === 'success',
        )
        .map((it) => it.data);

      const result: SuccessTestResult =
        successResults.reduce<SuccessTestResult>(
          (prev, { screenshots, config }): SuccessTestResult => {
            return {
              ...prev,
              screenshots: {
                final: [
                  ...prev.screenshots.final,
                  {
                    device: config.device,
                    presets: config.presets,
                    result: screenshots.final,
                  },
                ],
                others: screenshots.others.map((it, index) => {
                  return {
                    name: it.name,
                    configs: [
                      ...(prev.screenshots.others[index]?.configs ?? []),
                      {
                        device: config.device,
                        presets: config.presets,
                        result: it.result,
                      },
                    ],
                  };
                }),
              },
            };
          },
          {
            running: false,
            type: 'success',
            records: successResults[0].records,
            screenshots: {
              final: [],
              others: [],
            },
          } as SuccessTestResult,
        );

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}

function generateConfigs(
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
