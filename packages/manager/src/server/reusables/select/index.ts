import { FinderMeta, wait } from '@storyshots/core';
import { ElementHandle, Frame } from 'puppeteer';
import { selectG } from './selectG';
import { TIMEOUT } from './constants';
import { ElementGuard } from './types';

export async function select(
  frame: Frame,
  by: FinderMeta,
  guards: ElementGuard[],
): Promise<ElementHandle> {
  const controller = new AbortController();
  const selecting = selectG(frame, by, guards);
  let outcome: undefined | string = undefined;

  return Promise.race([
    drain(controller.signal, selecting, (step) => (outcome = step)),
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
    return (
      outcome ??
      `No attempts were made during provided time interval ${TIMEOUT} ms. It is probably due to engine slow start, try to rerun by pressing F5.`
    );
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
  generator: AsyncGenerator<string, ElementHandle, void>,
  onStep: (outcome: string) => void,
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
