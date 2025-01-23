import { assertNotEmpty } from '@storyshots/core';
import { OnHighlightFinish } from './useHighlighting';

export function onMouseOver(
  frame: Window,
  cb: (element: Element) => void,
): OnHighlightFinish {
  const listener = (event: MouseEvent) => {
    const element = frame.document.elementFromPoint(event.x, event.y);

    assertNotEmpty(element);

    cb(element);
  };

  frame.addEventListener('mouseover', listener);

  return () => frame.removeEventListener('mouseover', listener);
}
