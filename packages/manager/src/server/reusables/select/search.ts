import { ElementHandle, Frame } from 'puppeteer';
import { FinderMeta, isNil } from '@storyshots/core';

export async function search(
  element: Pick<Frame, '$$'>,
  by: FinderMeta,
): Promise<ElementHandle[]> {
  const elements = await element.$$(by.beginning.on);

  return narrow(elements, by.consequent);
}

async function narrow(
  elements: ElementHandle[],
  consequent: FinderMeta['consequent'],
): Promise<ElementHandle[]> {
  if (consequent.length === 0) {
    return elements;
  }

  const [condition, ...others] = consequent;

  switch (condition.type) {
    case 'index': {
      const found = elements[condition.at];

      return isNil(found) ? [] : narrow([found], others);
    }
    case 'filter': {
      const candidates: ElementHandle[] = [];
      for await (const element of elements) {
        const children = await search(element, condition.has);

        if (children.length > 0) {
          candidates.push(element);
        }
      }

      return narrow(candidates, others);
    }
    case 'selector': {
      const candidates: ElementHandle[] = [];
      for await (const element of elements) {
        const children = await element.$$(condition.on);

        const found = await narrow(children, others);

        candidates.push(...found);
      }

      return candidates;
    }
  }
}
