import { FillAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToSelect } from '../select';
import {
  assertIsEnabled,
  assertIsInsideViewport,
  assertIsStable,
  assertIsVisible,
} from '../select/assertions';

export async function tryFillAction(preview: Frame, action: FillAction) {
  const element = await tryToSelect(preview, action.payload.on, [
    assertIsVisible,
    assertIsInsideViewport,
    assertIsStable,
    // TODO: By label selector is checked in a wrong way against this guard
    assertIsEnabled,
  ]);

  if (!action.payload.options?.fast) {
    return element.type(action.payload.text, action.payload.options);
  }

  await element.evaluate(
    (_, text) => navigator.clipboard.writeText(text),
    action.payload.text,
  );

  await element.click();

  await preview.page().keyboard.down('ControlLeft');
  await preview.page().keyboard.press('V');
  await preview.page().keyboard.up('ControlLeft');
}
