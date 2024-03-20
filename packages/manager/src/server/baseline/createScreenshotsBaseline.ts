import path from 'path';
import { ScreenshotPath } from '../../reusables/types';
import { ServerConfig } from '../reusables/types';
import {
  constructScreenshotFileName,
  copy,
  exists,
  mkdir,
  mkfile,
  read,
} from './utils';
import {
  Device,
  not,
  ScreenshotName,
  SelectedPresets,
  StoryID,
} from '@storyshots/core';

export async function createScreenshotsBaseline(config: ServerConfig) {
  const actualResultsDir = path.join(config.paths.temp, 'actual');

  if (not(await exists(actualResultsDir))) {
    await mkdir(actualResultsDir);
  }

  if (not(await exists(config.paths.screenshots))) {
    await mkdir(config.paths.screenshots);
  }

  return {
    createActualScreenshot: async (
      id: StoryID,
      device: Device,
      presets: SelectedPresets,
      name: ScreenshotName | undefined,
      content: Buffer,
    ): Promise<ScreenshotPath> => {
      const dir = path.join(actualResultsDir, device.name);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      const at = path.join(dir, constructScreenshotFileName(id, name, presets));

      await mkfile(at, content);

      return at as ScreenshotPath;
    },
    getExpectedScreenshot: async (
      id: StoryID,
      device: Device,
      presets: SelectedPresets,
      name: ScreenshotName | undefined,
    ): Promise<ScreenshotPath | undefined> => {
      const image = constructScreenshotFileName(id, name, presets);
      const file = path.join(config.paths.screenshots, device.name, image);

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (screenshot: ScreenshotPath): Promise<void> => {
      const to = screenshot.replace(actualResultsDir, config.paths.screenshots);
      const dir = path.dirname(to);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      return copy(screenshot, to);
    },
  };
}
