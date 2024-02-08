import { ElementHandle, Frame } from 'puppeteer';
import { FinderMeta } from '../../reusables/finder';
import { WithPossibleError } from '../../reusables/types';
import { isNil, wait } from '../../reusables/utils';

export async function select(
  frame: Frame,
  by: FinderMeta,
): Promise<WithPossibleError<ElementHandle>> {
  const controller = new AbortController();

  return Promise.race([
    _select(frame, by, controller.signal).then(
      (element): WithPossibleError<ElementHandle> => ({
        type: 'success',
        data: element,
      }),
    ),
    wait(10_000)
      .then(() => controller.abort())
      .then(
        (): WithPossibleError<ElementHandle> => ({
          type: 'error',
          message: 'Element was not found withing given time interval',
        }),
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

    if (await elements[0].isVisible()) {
      return elements[0];
    }

    await wait(100);
  }
}

export async function begin(
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
