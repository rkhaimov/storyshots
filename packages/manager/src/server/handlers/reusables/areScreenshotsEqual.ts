import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export function areScreenshotsEqual(l: Buffer, r: Buffer): boolean {
  const left = PNG.sync.read(l);
  const right = PNG.sync.read(r);

  if (left.width !== right.width) {
    return false;
  }

  if (left.height !== right.height) {
    return false;
  }

  const diff = pixelmatch(left.data, right.data, null, left.width, left.height, { threshold: 0 });

  return diff === 0;
}
