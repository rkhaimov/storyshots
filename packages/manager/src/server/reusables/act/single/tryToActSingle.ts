import { ActionMeta, assertIsNever, ScreenshotAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryClickAction } from '../actions/tryClickAction';
import { tryFillAction } from '../actions/tryFillAction';
import { tryHoverAction } from '../actions/tryHoverAction';
import { tryKeyboardAction } from '../actions/tryKeyboardAction';
import { tryScrollToAction } from '../actions/tryScrollToAction';
import { trySelectAction } from '../actions/trySelectAction';
import { tryUploadFileAction } from '../actions/tryUploadFileAction';
import { tryWaitAction } from '../actions/tryWaitAction';

export async function tryToActSingle(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): Promise<unknown> {
  switch (action.action) {
    case 'click':
      return tryClickAction(preview, action);
    case 'fill':
      return tryFillAction(preview, action);
    case 'hover':
      return tryHoverAction(preview, action);
    case 'wait':
      return tryWaitAction(action);
    case 'scrollTo':
      return tryScrollToAction(preview, action);
    case 'select':
      return trySelectAction(preview, action);
    case 'uploadFile':
      return tryUploadFileAction(preview, action);
    case 'keyboard':
      return tryKeyboardAction(preview, action);
  }

  assertIsNever(action);
}
