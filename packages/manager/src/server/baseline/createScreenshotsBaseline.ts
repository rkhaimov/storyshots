import { not, ScreenshotName, StoryID, TestConfig } from '@storyshots/core';
import path from 'path';
import { ScreenshotPath } from '../../reusables/types';
import { ServerConfig } from '../reusables/types';
import { copy, exists, mkdir, mkfile, read } from './utils';

export async function createScreenshotsBaseline(env: ServerConfig) {
  const actualResultsDir = path.join(env.paths.temp, 'actual');
  const expectedResultsDir = env.paths.screenshots;

  return {
    createActualScreenshot: async (
      id: StoryID,
      config: TestConfig,
      name: ScreenshotName,
      content: Buffer,
    ): Promise<ScreenshotPath> => {
      const dir = path.join(actualResultsDir, createConcreteConfigPath(config));
      const at = path.join(dir, constructScreenshotFileName(id, name));

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      await mkfile(at, content);

      return at as ScreenshotPath;
    },
    getExpectedScreenshot: async (
      id: StoryID,
      config: TestConfig,
      name: ScreenshotName,
    ): Promise<ScreenshotPath | undefined> => {
      const image = constructScreenshotFileName(id, name);
      const file = path.join(
        expectedResultsDir,
        createConcreteConfigPath(config),
        image,
      );

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (temp: ScreenshotPath): Promise<void> => {
      const baseline = temp.replace(actualResultsDir, expectedResultsDir);
      const dir = path.dirname(baseline);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      return copy(temp, baseline);
    },
  };
}

function createConcreteConfigPath(config: TestConfig) {
  const presetDir = Object.entries(config.presets)
    .map(([name, value]) => `${name}-${value}`)
    .join('__');

  if (presetDir === '') {
    return config.device.name;
  }

  return path.join(config.device.name, presetDir);
}

function constructScreenshotFileName(
  id: StoryID,
  name: ScreenshotName,
): string {
  return `${id}_${name}.png`;
}
