import { ClickAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToSelect } from '../select';
import {
  assertIsEnabled,
  assertIsInsideViewport,
  assertIsStable,
  assertIsVisible,
} from '../select/assertions';

export async function tryClickAction(preview: Frame, action: ClickAction) {
  const element = await tryToSelect(preview, action.payload.on, [
    assertIsVisible,
    assertIsInsideViewport,
    assertIsStable,
    assertIsEnabled,
  ]);

  return element.click(action.payload.options);
}
