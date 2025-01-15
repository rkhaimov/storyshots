import { UploadFileAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { act } from '../index';

export async function tryUploadFileAction(
  preview: Frame,
  action: UploadFileAction,
) {
  const [chooser] = await Promise.all([
    preview.page().waitForFileChooser(),
    act(preview, [
      { action: 'click', payload: { on: action.payload.chooser } },
    ]),
  ]);

  return chooser.accept(action.payload.paths);
}
