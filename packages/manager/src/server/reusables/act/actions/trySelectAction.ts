import { SelectAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToSelect } from '../select';
import {
  assertIsEnabled,
  assertIsInsideViewport,
  assertIsStable,
  assertIsVisible,
} from '../select/assertions';

export async function trySelectAction(preview: Frame, action: SelectAction) {
  const element = await tryToSelect(preview, action.payload.on, [
    assertIsVisible,
    assertIsInsideViewport,
    assertIsStable,
    assertIsEnabled,
  ]);

  return element.select(...action.payload.values);
}
