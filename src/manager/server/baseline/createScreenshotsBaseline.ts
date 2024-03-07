import path from 'path';
import { StoryID } from '../../../reusables/story';
import { not } from '../../../reusables/utils';
import { ScreenshotPath } from '../../reusables/types';
import { Device } from '../../../reusables/test-presets';
import { ScreenshotName } from '../../../reusables/screenshot';
import { ServerConfig } from '../reusables/types';
import {
  constructScreenshotFileName,
  copy,
  exists,
  mkdir,
  mkfile,
  read,
} from './utils';

export async function createScreenshotsBaseline(config: ServerConfig) {
  const actualResultsDir = path.join(config.tempDirPath, 'actual');

  if (not(await exists(actualResultsDir))) {
    await mkdir(actualResultsDir);
  }

  if (not(await exists(config.screenshotsPath))) {
    await mkdir(config.screenshotsPath);
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
      const file = path.join(config.screenshotsPath, device.name, image);

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (screenshot: ScreenshotPath): Promise<void> => {
      const to = screenshot.replace(actualResultsDir, config.screenshotsPath);
      const dir = path.dirname(to);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      return copy(screenshot, to);
    },
  };
}
