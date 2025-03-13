import { assert } from '@storyshots/core';
import { useEffect, useState } from 'react';
import { PreviewBuildHash } from '../types';

export function useBuildHash() {
  const [hash, setHash] = useState<PreviewBuildHash>();

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}?manager=SECRET`);

    ws.addEventListener('message', (event) => {
      assert(typeof event.data === 'string');

      setHash(event.data as PreviewBuildHash);
    });

    return () => ws.close();
  }, []);

  return hash;
}
