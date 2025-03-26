import { ScreenshotAction } from '@core';
import { isNil } from '@lib';
import { Frame } from 'playwright';
import { PageScreenshotOptions } from 'playwright-core';
import { select } from '../../../../select';

export function captureBase(preview: Frame, action: ScreenshotAction) {
  return preview.page().screenshot({
    type: 'png',
    caret: 'hide',
    animations: 'disabled',
    ...toMaskOptions(preview, action),
  });
}

function toMaskOptions(
  preview: Frame,
  action: ScreenshotAction,
): PageScreenshotOptions {
  const mask = action.payload.options?.mask;

  if (isNil(mask) || mask.length === 0) {
    return {};
  }

  return {
    mask: mask.map((finder) => select(preview, finder)),
    maskColor: action.payload.options?.maskColor,
  };
}
