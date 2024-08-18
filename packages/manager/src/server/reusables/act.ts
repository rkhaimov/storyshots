import { ActionMeta, assertIsNever, isNil, wait } from '@storyshots/core';
import { ElementHandle, Frame } from 'puppeteer';
import { select } from './select';
import { ScreenshotAction } from './types';
import { ElementGuard } from './select/types';
import { TIMEOUT } from './select/constants';
import { isInsideViewport, isStable, isVisible } from './select/guards';

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

  const element = await select(
    preview,
    action.payload.on,
    actionToGuards(action),
  );

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

function actionToGuards(
  action: Extract<
    ActionMeta,
    { action: 'click' | 'fill' | 'hover' | 'scroll-to' | 'scroll' }
  >,
): ElementGuard[] {
  switch (action.action) {
    case 'click':
    case 'fill':
      return [isVisible, isInsideViewport, isStable, isEnabled];
    case 'hover':
    case 'scroll-to':
    case 'scroll':
      return [isVisible, isInsideViewport, isStable];
  }
}

const isEnabled: ElementGuard = async (element) => {
  const disabled = await element.evaluate((it) => {
    const controls = [
      'BUTTON',
      'INPUT',
      'SELECT',
      'TEXTAREA',
      'OPTION',
      'OPTGROUP',
    ];

    if (controls.includes(it.nodeName)) {
      return it.hasAttribute('disabled');
    }

    return false;
  });

  if (disabled) {
    return {
      pass: false,
      reason: `Matched element appears to be disabled. It remained to be so during provided time interval ${TIMEOUT} ms.`,
    };
  }

  return { pass: true };
};

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

async function scroll(
  preview: Frame,
  action: Extract<ActionMeta, { action: 'scroll' }>,
): Promise<void> {
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

  const element = await select(preview, selector, actionToGuards(action));

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
