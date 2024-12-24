import { ActionMeta, ScreenshotAction, wait } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { actUntilSuccess } from './actUntilSuccess';
import { TIMEOUT } from './constants';
import { createPromiseFromGenerator } from './createPromiseFromGenerator';
import { enrichErrorMessage } from './enrichErrorMessage';

export function tryToActUntilSuccessWithTimeout(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
) {
  const abort = new AbortController();
  const acting = actUntilSuccess(preview, action);
  let error = DEFAULT_ERROR;

  return Promise.race([
    createPromiseFromGenerator(
      acting,
      (intermediate) => (error = intermediate),
      abort.signal,
    ),
    wait(TIMEOUT)
      .then(() => abort.abort())
      .then(() => Promise.reject(new Error(enrichErrorMessage(error, action)))),
  ]);
}

const DEFAULT_ERROR = `No attempts were made during provided time interval. It is probably due to engine slow start, try to rerun by pressing F5.`;
