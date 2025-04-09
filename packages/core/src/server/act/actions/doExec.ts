import { ExecAction } from '@core';
import { Frame } from 'playwright';

export function doExec(preview: Frame, exec: ExecAction) {
  return preview.evaluate(`(${exec.payload.fn})()`);
}
