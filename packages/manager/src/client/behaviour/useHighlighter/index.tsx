import { useHighlighting } from './useHighlighting';
import { createHighlighter } from './createHighlighter/createHighlighter';
import { onMouseOver } from './onMouseOver';

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
