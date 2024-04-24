import { ActionMeta, assertIsNever, isNil, wait } from '@storyshots/core';
import { ElementHandle, Frame } from 'puppeteer';
import { select } from './select';
import { ScreenshotAction } from './types';

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
      return fill(element, action);
    case 'scroll-to':
      return element.scrollIntoView();
  }

  assertIsNever(action);
}

async function fill(
  element: ElementHandle,
  action: Extract<ActionMeta, { action: 'fill' }>,
) {
  await (element as ElementHandle<HTMLInputElement>).evaluate((input) => {
    if (input.isContentEditable) {
      input.innerText = '';
    } else {
      input.value = '';
    }
  });

  return element.type(action.payload.text, action.payload.options);
}

async function scroll(preview: Frame, action: Extract<ActionMeta, { action: 'scroll' }>): Promise<void> {
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
