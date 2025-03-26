import { HighlightAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doHighlight(preview: Frame, highlight: HighlightAction) {
  return select(preview, highlight.payload.on).highlight();
}
