import { BoundingBox, ElementHandle, Frame } from 'puppeteer';
import { FinderMeta } from '../../reusables/finder';
import { isNil, not, wait } from '../../reusables/utils';

export async function select(
  frame: Frame,
  by: FinderMeta,
): Promise<ElementHandle> {
  const controller = new AbortController();

  return Promise.race([
    _select(frame, by, controller.signal),
    wait(TIMEOUT)
      .then(() => controller.abort())
      .then(() =>
        Promise.reject(
          new Error(
            `Element was not found within given time interval (${TIMEOUT} ms)`,
          ),
        ),
      ),
  ]);
}

async function _select(
  frame: Frame,
  by: FinderMeta,
  signal: AbortSignal,
): Promise<ElementHandle> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    signal.throwIfAborted();

    const elements = await begin(frame, by);

    if (elements.length === 0) {
      await wait(100);

      continue;
    }

    if (elements.length > 1) {
      console.warn(
        `Found too many elements (${elements.length}). Picking first occurrence`,
      );
    }

    const element = elements[0];

    if (not(await element.isVisible())) {
      await wait(100);

      continue;
    }

    if (not(await element.isIntersectingViewport({ threshold: 0 }))) {
      await element.scrollIntoView();
      await wait(100);

      continue;
    }

    const first = await getBoundingBox(element);
    const second = await getBoundingBox(element);

    if (not(equals(first, second))) {
      await wait(100);

      continue;
    }

    return element;
  }
}

function equals(left: BoundingBox, right: BoundingBox): boolean {
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.width === right.width &&
    left.height === right.height
  );
}

function getBoundingBox(element: ElementHandle): Promise<BoundingBox> {
  return element.evaluate(
    (it) =>
      new Promise<BoundingBox>((resolve) =>
        window.requestAnimationFrame(() => resolve(it.getBoundingClientRect())),
      ),
  );
}

async function begin(
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
        const children = await begin(element, condition.has);

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

const TIMEOUT = 10_000;
