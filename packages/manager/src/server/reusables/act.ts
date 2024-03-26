import {
  ActionMeta,
  assertIsNever,
  isNil,
  ScreenshotAction,
  ScrollAction,
  wait,
} from '@storyshots/core';
import { Frame } from 'puppeteer';
import { select } from './select';

export async function act(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): Promise<void> {
  if (action.action === 'wait') {
    return wait(action.payload.ms);
  }

  if (action.action === 'scroll') {
    return scroll(preview, action);
  }

  const element = await select(preview, action.payload.on);

  switch (action.action) {
    case 'click':
      return element.click(action.payload.options);
    case 'hover':
      return element.hover();
    case 'fill':
      return element.type(action.payload.text, action.payload.options);
    case 'scroll-to':
      return element.scrollIntoView();
  }

  assertIsNever(action);
}

async function scroll(preview: Frame, action: ScrollAction): Promise<void> {
  const selector = action.payload.on;

  if (isNil(selector)) {
    return preview.evaluate(
      ([y, x]) =>
        window.scrollBy({
          top: y,
          left: x,
          behavior: 'instant',
        }),
      [action.payload.y, action.payload.x],
    );
  }

  const element = await select(preview, selector);

  return element.evaluate(
    (it, [y, x]) =>
      it.scrollBy({
        top: y,
        left: x,
        behavior: 'instant',
      }),
    [action.payload.y, action.payload.x],
  );
}
