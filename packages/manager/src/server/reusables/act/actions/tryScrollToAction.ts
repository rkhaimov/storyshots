import { ScrollToAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToSelect } from '../select';
import {
  assertIsInsideViewport,
  assertIsStable,
  assertIsVisible,
} from '../select/assertions';

export async function tryScrollToAction(
  preview: Frame,
  action: ScrollToAction,
) {
  const element = await tryToSelect(preview, action.payload.on, [
    assertIsVisible,
    assertIsInsideViewport,
    assertIsStable,
  ]);

  return element.scrollIntoView();
}
