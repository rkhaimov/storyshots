import { assert, FinderMeta } from '@storyshots/core';
import { ElementHandle, Frame } from 'puppeteer';
import { ElementAssertion } from './types';
import { search } from './search';

export async function tryToSelect(
  frame: Frame,
  by: FinderMeta,
  assertions: ElementAssertion[],
): Promise<ElementHandle> {
  const elements = await search(frame, by);

  assert(
    elements.length > 0,
    `Element was not found during provided time interval.`,
  );

  for (const assertion of assertions) {
    await assertion(elements[0]);
  }

  return elements[0];
}
