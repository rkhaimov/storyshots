import { PressSequentiallyAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { select } from '../../select';

export async function doPressSequentially(
  preview: Frame,
  pressSequentially: PressSequentiallyAction,
) {
  return select(preview, pressSequentially.payload.on).pressSequentially(
    pressSequentially.payload.text,
    pressSequentially.payload.options,
  );
}
