import { ScrollToAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doScrollTo(preview: Frame, scrollTo: ScrollToAction) {
  return select(preview, scrollTo.payload.on).scrollIntoViewIfNeeded(
    scrollTo.payload.options,
  );
}
