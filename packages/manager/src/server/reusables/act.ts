import {
  ActionMeta,
  assertIsNever,
  FillAction,
  ScreenshotAction,
  wait,
  WaitAction,
} from '@storyshots/core';
import { ElementHandle, Frame } from 'puppeteer';
import { select } from './select';
import { ElementGuard } from './select/types';
import { TIMEOUT } from './select/constants';
import { isInsideViewport, isStable, isVisible } from './select/guards';

export async function act(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): Promise<unknown> {
  if (action.action === 'wait') {
    return wait(action.payload.ms);
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
    case 'scrollTo':
      return element.scrollIntoView();
    case 'select':
      return element.select(...action.payload.values);
    case 'uploadFile':
      return (element as ElementHandle<HTMLInputElement>).uploadFile(
        ...action.payload.paths,
      );
  }

  assertIsNever(action);
}

function actionToGuards(
  action: Exclude<ActionMeta, WaitAction | ScreenshotAction>,
): ElementGuard[] {
  switch (action.action) {
    case 'click':
    case 'fill':
    case 'select':
    case 'uploadFile':
      return [isVisible, isInsideViewport, isStable, isEnabled];
    case 'hover':
    case 'scrollTo':
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

async function fill(element: ElementHandle, action: FillAction) {
  await (element as ElementHandle<HTMLInputElement>).evaluate((input) => {
    if (input.isContentEditable) {
      input.innerText = '';
    } else {
      input.value = '';
    }
  });

  return element.type(action.payload.text, action.payload.options);
}
