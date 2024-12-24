import { assert } from '@storyshots/core';
import { BoundingBox, ElementHandle } from 'puppeteer';
import { ElementAssertion } from './types';

export const assertIsVisible: ElementAssertion = async (element) => {
  assert(
    await element.isVisible(),
    `Element was found but did not become visible during provided interval. It has happened most likely due to element having zero area.`,
  );
};

export const assertIsInsideViewport: ElementAssertion = async (element) => {
  if (await element.isIntersectingViewport({ threshold: 0 })) {
    return;
  }

  await element.scrollIntoView();

  throw new Error(
    `Element happens to be outside of current viewport. Storyshots library scrolls to element automatically but it was not able to do it during provided interval. Try to use separate scroll action when auto-scroll does not work.`,
  );
};

export const assertIsStable: ElementAssertion = async (element) => {
  const first = await getBoundingBox(element);
  const second = await getBoundingBox(element);

  assert(
    equals(first, second),
    `Matched element appears to be not stable. It did not stop moving during provided interval. Try to disable animations with stubs.`,
  );

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
          window.requestAnimationFrame(() => {
            const rect = it.getBoundingClientRect();

            resolve({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            });
          }),
        ),
    );
  }
};

export const assertIsEnabled: ElementAssertion = async (element) => {
  const disabled = await element.evaluate((it) => {
    const controls = [
      'BUTTON',
      'INPUT',
      'SELECT',
      'TEXTAREA',
      'OPTION',
      'OPTGROUP',
    ];

    if (controls.includes(it.nodeName)) {
      return it.hasAttribute('disabled');
    }

    return false;
  });

  assert(
    !disabled,
    `Matched element appears to be disabled. It remained to be so during provided time interval.`,
  );
};
