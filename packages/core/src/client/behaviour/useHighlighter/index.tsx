import { createHighlighter } from './createHighlighter/createHighlighter';
import { onMouseOver } from './onMouseOver';
import { useHighlighting } from './useHighlighting';

export function useHighlighter() {
  return useHighlighting(async (frame) => {
    const { highlight, hide } = await createHighlighter(frame);
    const stop = onMouseOver(frame, highlight);

    return () => {
      stop();

      hide();
    };
  });
}
