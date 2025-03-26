import { HoverAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doHover(preview: Frame, hover: HoverAction) {
  return select(preview, hover.payload.on).hover(hover.payload.options);
}
