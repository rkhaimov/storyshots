import {
  Device,
  ScreenshotName,
  ScreenshotPath,
  StoryID,
} from '../../reusables/types';
import { isNil, not } from '../../reusables/utils';
import path from 'path';
import { copy, exists, mkdir, mkfile, read } from './utils';

export async function createScreenshotsBaseline() {
  const actualResultsDir = path.join(process.cwd(), 'temp', 'actual');

  if (not(await exists(actualResultsDir))) {
    await mkdir(actualResultsDir);
  }

  const expectedResultsDir = path.join(process.cwd(), 'screenshots');

  if (not(await exists(expectedResultsDir))) {
    await mkdir(expectedResultsDir);
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
      const file = path.join(expectedResultsDir, device.name, image);

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (screenshot: ScreenshotPath): Promise<void> => {
      const to = screenshot.replace(actualResultsDir, expectedResultsDir);
      const dir = path.dirname(to);

      if (not(await exists(dir))) {
        await mkdir(dir);
      }

      return copy(screenshot, to);
    },
  };
}
