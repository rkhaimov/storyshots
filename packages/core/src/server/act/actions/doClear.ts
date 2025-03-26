import { ClearAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doClear(preview: Frame, clear: ClearAction) {
  return select(preview, clear.payload.on).clear(clear.payload.options);
}
