import { KeyboardAction } from '@core';
import { Frame } from 'playwright';

export function doKeyboard(preview: Frame, action: KeyboardAction) {
  return preview.page().keyboard[action.payload.type](action.payload.input);
}
