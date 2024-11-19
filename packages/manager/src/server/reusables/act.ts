import {
  ActionMeta,
  assertIsNever,
  FillAction,
  KeyboardAction,
  ScreenshotAction,
  UploadFileAction,
  wait,
  WaitAction,
} from '@storyshots/core';
import { ElementHandle, Frame } from 'puppeteer';
import { select } from './select';
import { TIMEOUT } from './select/constants';
import { isInsideViewport, isStable, isVisible } from './select/guards';
import { ElementGuard } from './select/types';

export async function act(
  preview: Frame,
  actions: ActionMeta[],
  onScreenshot: (action: ScreenshotAction) => Promise<void> = async () => {},
): Promise<void> {
  for (const action of actions) {
    if (action.action === 'screenshot') {
      await onScreenshot(action);

      continue;
    }

    await actSingle(preview, action);
  }
}

async function actSingle(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): Promise<unknown> {
  if (action.action === 'wait') {
    return wait(action.payload.ms);
  }

  if (action.action === 'uploadFile') {
    return upload(preview, action);
  }

  if (action.action === 'keyboard') {
    return keyboard(preview, action);
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
  }

  assertIsNever(action);
}

function keyboard(preview: Frame, action: KeyboardAction) {
  return preview.page().keyboard[action.payload.type](action.payload.input);
}

async function upload(preview: Frame, action: UploadFileAction) {
  const [chooser] = await Promise.all([
    preview.page().waitForFileChooser(),
    act(preview, [
      { action: 'click', payload: { on: action.payload.chooser } },
    ]),
  ]);

  return chooser.accept(action.payload.paths);
}

function actionToGuards(
  action: Exclude<
    ActionMeta,
    WaitAction | ScreenshotAction | UploadFileAction | KeyboardAction
  >,
): ElementGuard[] {
  switch (action.action) {
    case 'click':
    case 'fill':
    case 'select':
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
