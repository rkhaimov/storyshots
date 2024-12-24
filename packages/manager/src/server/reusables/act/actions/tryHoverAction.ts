import { HoverAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToSelect } from '../select';
import {
  assertIsInsideViewport,
  assertIsStable,
  assertIsVisible,
} from '../select/assertions';

export async function tryHoverAction(preview: Frame, action: HoverAction) {
  const element = await tryToSelect(preview, action.payload.on, [
    assertIsVisible,
    assertIsInsideViewport,
    assertIsStable,
  ]);

  return element.hover();
}
