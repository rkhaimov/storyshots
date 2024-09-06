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
  await wait(100);

  const elements = await search(frame, by);

  if (elements.length === 0) {
    yield `Element was not found during provided time interval ${TIMEOUT} ms.`;

    return yield* selectG(frame, by, guards);
  }

  const element = elements[0];

  for (const guard of guards) {
    const result = await guard(element);

    if (result.pass) {
      continue;
    }

    yield result.reason;

    return yield* selectG(frame, by, guards);
  }

  return element;
}
