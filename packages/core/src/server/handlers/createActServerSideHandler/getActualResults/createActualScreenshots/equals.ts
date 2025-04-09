import { Screenshot } from '../../../../../reusables/types';
import { ExpectedPayload } from '../types';

export async function equals(
  payload: ExpectedPayload,
  screenshot: Buffer,
  other: Screenshot,
) {
  const { equal } = await payload.config.compare(
    screenshot,
    await payload.baseline.readScreenshot(other.path),
    payload.story,
  );

  return equal;
}
