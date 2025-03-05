import { DragAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doDrag(preview: Frame, drag: DragAction) {
  return select(preview, drag.payload.draggable).dragTo(
    select(preview, drag.payload.to),
  );
}
