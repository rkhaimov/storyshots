import { KeyboardAction } from '@storyshots/core';
import { Frame } from 'puppeteer';

export function tryKeyboardAction(preview: Frame, action: KeyboardAction) {
  return preview.page().keyboard[action.payload.type](action.payload.input);
}
