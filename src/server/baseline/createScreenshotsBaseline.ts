import path from 'path';
import {
  Device,
  ScreenshotName,
  ScreenshotPath, StoryID,

} from '../../reusables/types';
import { isNil, not } from '../../reusables/utils';
import { ServerConfig } from '../reusables/types';
import { copy, exists, mkdir, mkfile, read } from './utils';

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
      name: ScreenshotName | undefined,
      content: Buffer,
    ): Promise<ScreenshotPath> => {
      const dir = path.join(actualResultsDir, device.name);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      const at = path.join(
        dir,
        isNil(name) ? `${id}.png` : `${id}_${name}.png`,
      );

      await mkfile(at, content);

      return at as ScreenshotPath;
    },
    getExpectedScreenshot: async (
      id: StoryID,
      device: Device,
      name: ScreenshotName | undefined,
    ): Promise<ScreenshotPath | undefined> => {
      const image = isNil(name) ? `${id}.png` : `${id}_${name}.png`;
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
