import { KeyboardAction } from '@storyshots/core';
import { Frame } from 'playwright';

export function doKeyboard(preview: Frame, action: KeyboardAction) {
  return preview.page().keyboard[action.payload.type](action.payload.input);
}
