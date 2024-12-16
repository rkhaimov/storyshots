import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { ScreenshotPath } from '../../reusables/types';
import { Baseline } from '../reusables/baseline';

export async function areScreenshotsEqual(
  baseline: Baseline,
  left: ScreenshotPath,
  right: ScreenshotPath,
) {
  return equal(
    await baseline.readScreenshot(left),
    await baseline.readScreenshot(right),
  );
}

function equal(l: Buffer, r: Buffer): boolean {
  const left = PNG.sync.read(l);
  const right = PNG.sync.read(r);

  if (left.width !== right.width) {
    return false;
  }

  if (left.height !== right.height) {
    return false;
  }

  const diff = pixelmatch(
    left.data,
    right.data,
    null,
    left.width,
    left.height,
    { threshold: 0 },
  );

  return diff === 0;
}
