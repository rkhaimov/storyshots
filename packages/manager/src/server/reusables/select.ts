import { FinderMeta, isNil, not, wait } from '@storyshots/core';
import { BoundingBox, ElementHandle, Frame } from 'puppeteer';

export async function select(
  frame: Frame,
  by: FinderMeta,
): Promise<ElementHandle> {
  const controller = new AbortController();
  const selecting = _select(frame, by);
  let last: undefined | SelectionsOutcome = undefined;

  return Promise.race([
    drain(controller.signal, selecting, (step) => (last = step)),
    wait(TIMEOUT)
      .then(() => controller.abort())
      .then(() =>
        Promise.reject(
          new Error(
            `${createErrorMessage()} Selector used ${selectorToString(by)}`,
          ),
        ),
      ),
  ]);

  function createErrorMessage(): string {
    switch (last) {
      case undefined:
        return `No attempts were made during provided time interval ${TIMEOUT} ms. It is probably due to engine slow start, try to rerun by pressing F5.`;
      case 'not_found':
        return `Element was not found during provided time interval ${TIMEOUT} ms.`;
      case 'not_visible':
        return `Element was found but did not become visible during provided interval ${TIMEOUT} ms. It has happened most likely due to element having zero area.`;
      case 'outside_viewport':
        return `Element happens to be outside of current viewport. Storyshots library scrolls to element automatically but it was not able to do it during provided interval ${TIMEOUT} ms. Try to use separate scroll action when auto-scroll does not work.`;
      case 'not_stable':
        return `Matched element appears to be not stable. It did not stop moving during provided interval ${TIMEOUT} ms. Try to disable animations with stubs.`;
    }
  }

  function selectorToString(by: FinderMeta): string {
    return `${by.beginning.on} ${by.consequent
      .map((it): string => {
        switch (it.type) {
          case 'selector':
            return it.on;
          case 'index':
            return `[${it.at}]`;
          case 'filter':
            return `has(${selectorToString(it.has)})`;
        }
      })
      .join(' ')}`;
  }
}

async function drain(
  signal: AbortSignal,
  generator: AsyncGenerator<SelectionsOutcome, ElementHandle, void>,
  onStep: (outcome: SelectionsOutcome) => void,
): Promise<ElementHandle> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    signal.throwIfAborted();

    const step = await generator.next();

    if (step.done) {
      return step.value;
    }

    onStep(step.value);
  }
}

type SelectionsOutcome =
  | 'not_found'
  | 'not_visible'
  | 'outside_viewport'
  | 'not_stable';

async function* _select(
  frame: Frame,
  by: FinderMeta,
): AsyncGenerator<SelectionsOutcome, ElementHandle, void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const elements = await begin(frame, by);

    if (elements.length === 0) {
      yield 'not_found';

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
      yield 'not_visible';

      await wait(100);

      continue;
    }

    if (not(await element.isIntersectingViewport({ threshold: 0 }))) {
      yield 'outside_viewport';

      await element.scrollIntoView();
      await wait(100);

      continue;
    }

    const first = await getBoundingBox(element);
    const second = await getBoundingBox(element);

    if (not(equals(first, second))) {
      yield 'not_stable';

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
