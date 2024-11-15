import { ElementHandle, Frame } from 'puppeteer';
import { FinderMeta, wait } from '@storyshots/core';
import { search } from './search';
import { ElementGuard } from './types';
import { TIMEOUT } from './constants';

export async function* selectG(
  frame: Frame,
  by: FinderMeta,
  guards: ElementGuard[],
): AsyncGenerator<string, ElementHandle, void> {
  const element = yield* createSingleElementBySelector(frame, by, guards);

  return yield* createValidElement(element, guards);
}

async function* createSingleElementBySelector(
  frame: Frame,
  by: FinderMeta,
  guards: ElementGuard[],
): AsyncGenerator<string, ElementHandle, void> {
  const elements = await search(frame, by);

  if (elements.length === 0) {
    yield `Element was not found during provided time interval ${TIMEOUT} ms.`;

    await wait(100);

    return yield* createSingleElementBySelector(frame, by, guards);
  }

  return elements[0];
}

async function* createValidElement(
  element: ElementHandle,
  guards: ElementGuard[],
): AsyncGenerator<string, ElementHandle, void> {
  if (guards.length === 0) {
    return element;
  }

  const [head, ...tail] = guards;

  const result = await head(element);

  if (result.pass) {
    return yield* createValidElement(element, tail);
  }

  yield result.reason;

  await wait(100);

  return yield* createValidElement(element, guards);
}
