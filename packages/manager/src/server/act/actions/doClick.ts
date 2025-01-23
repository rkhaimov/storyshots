import { ClickAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { select } from '../select';

export function doClick(preview: Frame, click: ClickAction) {
  return select(preview, click.payload.on).click(click.payload.options);
}
