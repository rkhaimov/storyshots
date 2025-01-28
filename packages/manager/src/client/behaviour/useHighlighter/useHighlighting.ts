import { useState } from 'react';
import { assertNotEmpty, isNil } from '@storyshots/core';

export function useHighlighting(cb: OnHighlightStart) {
  const [onDone, setOnDone] = useState<OnHighlightFinish>();
  const highlighting = !isNil(onDone);

  return {
    toggle: async () => {
      if (highlighting) {
        onDone();

        setOnDone(undefined);

        return;
      }

      const preview = document.querySelector<HTMLIFrameElement>('#preview');
      const frame = preview?.contentWindow;

      assertNotEmpty(frame);

      const stop = await cb(frame);

      setOnDone(() => stop);
    },
    highlighting,
  };
}

type OnHighlightStart = (frame: Window) => Promise<OnHighlightFinish>;

export type OnHighlightFinish = () => void;
