import { BlurAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doBlur(preview: Frame, blur: BlurAction) {
  return select(preview, blur.payload.on).blur(blur.payload.options);
}
