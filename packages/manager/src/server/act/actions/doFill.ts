import { FillAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { select } from '../select';

export async function doFill(preview: Frame, fill: FillAction) {
  return select(preview, fill.payload.on).fill(
    fill.payload.text,
    fill.payload.options,
  );
}
