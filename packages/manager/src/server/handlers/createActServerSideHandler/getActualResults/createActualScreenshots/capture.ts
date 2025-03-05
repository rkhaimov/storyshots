import { ScreenshotAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { ExpectedPayload } from '../types';
import { captureBase } from './captureBase';

export function capture(
  { config, story }: ExpectedPayload,
  preview: Frame,
  action: ScreenshotAction,
) {
  return config.capture({
    story,
    page: preview.page(),
    capture: () => captureBase(preview, action),
    manager: config,
  });
}
