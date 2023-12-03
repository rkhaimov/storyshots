import { ScreenshotName, ScreenshotPath, StoryID } from '../../reusables/types';
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
      name: ScreenshotName | undefined,
      content: Buffer,
    ): Promise<ScreenshotPath> => {
      const file = path.join(
        actualResultsDir,
        isNil(name) ? `${id}.png` : `${id}_${name}.png`,
      );

      await mkfile(file, content);

      return file as ScreenshotPath;
    },
    getExpectedScreenshot: async (
      id: StoryID,
      name: ScreenshotName | undefined,
    ): Promise<ScreenshotPath | undefined> => {
      const image = isNil(name) ? `${id}.png` : `${id}_${name}.png`;
      const file = path.join(expectedResultsDir, image);

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (path: ScreenshotPath): Promise<void> =>
      copy(path, path.replace(actualResultsDir, expectedResultsDir)),
  };
}
