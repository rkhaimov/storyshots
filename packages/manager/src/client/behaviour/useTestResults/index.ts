import { useState } from 'react';
import { ScreenshotPath } from '../../../reusables/types';
import { useDriver } from '../../driver';
import { createResult } from './createRunTestResult';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotGroupResult,
  SingleConfigScreenshotResult,
  SuccessTestResult,
  TestResult,
  TestResults,
} from './types';
import {
  assertNotEmpty,
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
      const results = await createResult(
        externals,
        story,
        devices.primary,
        presets,
      );

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

      const [screenshots, records] = results.data;

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
      let final: SingleConfigScreenshotResult[] = [];
      let others: ScreenshotGroupResult[] = [];
      let records: RecordsComparisonResult | null = null;

      for (const config of allConfigs) {
        const results = await createResult(
          externals,
          story,
          config.device,
          config.presets,
        );

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

          return;
        }

        const [screenshots, resultRecords] = results.data;

        if (records === null) {
          records = resultRecords;
        }

        final = [
          ...final,
          {
            device: config.device,
            presets: config.presets,
            result: screenshots.final,
          },
        ];

        for (const configResult of screenshots.others) {
          const index = others.findIndex(
            (value) => value.name === configResult.name,
          );

          const screenshotResult = {
            device: config.device,
            presets: config.presets,
            result: configResult.result,
          };

          if (index === -1) {
            others = [
              ...others,
              {
                name: configResult.name,
                configs: [screenshotResult],
              },
            ];
          } else {
            others[index].configs = [
              ...others[index].configs,
              screenshotResult,
            ];
          }
        }
      }

      assertNotEmpty(records);

      const result: TestResult = {
        running: false,
        type: 'success',
        records,
        screenshots: {
          final,
          others,
        },
      };

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}

//TODO: TestConfig переиспользовать
type SingleConfig = {
  device: Device;
  presets: SelectedPresets;
};

function generateConfigs(
  devices: DevicePresets,
  presets: PurePresetGroup[],
): SingleConfig[] {
  const initialConfigs: SingleConfig[] = toFlatDevices(devices).map(
    (device) => ({ device, presets: {} }),
  );

  return presets.reduce<SingleConfig[]>((configs, presetGroup) => {
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
