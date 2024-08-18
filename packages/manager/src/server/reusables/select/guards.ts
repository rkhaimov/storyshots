import { ElementGuard } from './types';
import { BoundingBox, ElementHandle } from 'puppeteer';
import { TIMEOUT } from './constants';

export const isVisible: ElementGuard = async (element) => {
  if (await element.isVisible()) {
    return { pass: true };
  }

  return {
    pass: false,
    reason: `Element was found but did not become visible during provided interval ${TIMEOUT} ms. It has happened most likely due to element having zero area.`,
  };
};

export const isInsideViewport: ElementGuard = async (element) => {
  if (await element.isIntersectingViewport({ threshold: 0 })) {
    return { pass: true };
  }

  await element.scrollIntoView();

  return {
    pass: false,
    reason: `Element happens to be outside of current viewport. Storyshots library scrolls to element automatically but it was not able to do it during provided interval ${TIMEOUT} ms. Try to use separate scroll action when auto-scroll does not work.`,
  };
};

export const isStable: ElementGuard = async (element) => {
  const first = await getBoundingBox(element);
  const second = await getBoundingBox(element);

  if (equals(first, second)) {
    return { pass: true };
  }

  return {
    pass: false,
    reason: `Matched element appears to be not stable. It did not stop moving during provided interval ${TIMEOUT} ms. Try to disable animations with stubs.`,
  };

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
          window.requestAnimationFrame(() =>
            resolve(it.getBoundingClientRect()),
          ),
        ),
    );
  }
};