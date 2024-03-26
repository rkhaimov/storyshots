import {
  isNil,
  not,
  ScreenshotName,
  SelectedPresets,
  StoryID,
} from '@storyshots/core';
import path from 'path';
import { TestConfig } from '../../client/behaviour/useTestResults/types';
import { ScreenshotPath } from '../../reusables/types';
import { ServerConfig } from '../reusables/types';
import { copy, exists, mkdir, mkfile, read } from './utils';

export async function createScreenshotsBaseline(env: ServerConfig) {
  const actualResultsDir = path.join(env.paths.temp, 'actual');

  if (not(await exists(actualResultsDir))) {
    await mkdir(actualResultsDir);
  }

  if (not(await exists(env.paths.screenshots))) {
    await mkdir(env.paths.screenshots);
  }

  return {
    createActualScreenshot: async (
      id: StoryID,
      config: TestConfig,
      name: ScreenshotName | undefined,
      content: Buffer,
    ): Promise<ScreenshotPath> => {
      const dir = path.join(
        actualResultsDir,
        constructScreenshotDirName(config.device.name, config.presets),
      );

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      const at = path.join(dir, constructScreenshotFileName(id, name));

      await mkfile(at, content);

      return at as ScreenshotPath;
    },
    getExpectedScreenshot: async (
      id: StoryID,
      config: TestConfig,
      name: ScreenshotName | undefined,
    ): Promise<ScreenshotPath | undefined> => {
      const image = constructScreenshotFileName(id, name);
      const file = path.join(
        env.paths.screenshots,
        constructScreenshotDirName(config.device.name, config.presets),
        image,
      );

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (screenshot: ScreenshotPath): Promise<void> => {
      const to = screenshot.replace(actualResultsDir, env.paths.screenshots);
      const dir = path.dirname(to);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      return copy(screenshot, to);
    },
  };
}

function constructScreenshotDirName(
  deviceName: string,
  presets: SelectedPresets,
) {
  const presetsName = Object.entries(presets ?? {})
    .map((entry) => entry.join('-'))
    .join('_');

  return presetsName == '' ? deviceName : `${deviceName}_${presetsName}`;
}

function constructScreenshotFileName(
  id: StoryID,
  name: ScreenshotName | undefined,
): string {
  return isNil(name) ? `${id}.png` : `${id}_${name}.png`;
}
