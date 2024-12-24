import { ElementHandle } from 'puppeteer';
import { FinderMeta, isNil } from '@storyshots/core';

export async function search(
  root: Root,
  by: FinderMeta,
): Promise<ElementHandle[]> {
  const elements = await root.$$(by.beginning.on);

  return narrow(root, elements, by.consequent);
}

async function narrow(
  root: Root,
  found: ElementHandle[],
  selectors: FinderMeta['consequent'],
): Promise<ElementHandle[]> {
  if (selectors.length === 0) {
    return found;
  }

  const [selector, ...others] = selectors;

  switch (selector.type) {
    case 'index': {
      const element = found[selector.at];

      return isNil(element) ? [] : narrow(root, [element], others);
    }
    case 'filter': {
      const candidates: ElementHandle[] = [];
      for await (const element of found) {
        const children = await search(element, selector.has);

        if (children.length > 0) {
          candidates.push(element);
        }
      }

      return narrow(root, candidates, others);
    }
    case 'and': {
      const additional = await search(root, selector.condition);

      const candidates: ElementHandle[] = [];
      for await (const element of found) {
        if (await includes(element, additional)) {
          candidates.push(element);
        }
      }

      return narrow(root, candidates, others);
    }
    case 'selector': {
      const candidates: ElementHandle[] = [];
      for await (const element of found) {
        const children = await element.$$(selector.on);

        candidates.push(...(await narrow(root, children, others)));
      }

      return candidates;
    }
  }
}

type Root = Pick<ElementHandle, '$$'>;

async function includes(
  target: ElementHandle,
  inside: ElementHandle[],
): Promise<boolean> {
  for await (const element of inside) {
    if (await equals(target, element)) {
      return true;
    }
  }

  return false;
}

function equals(l: ElementHandle, r: ElementHandle): Promise<boolean> {
  return l.evaluate((_l, _r) => _l === _r, l, r);
}
