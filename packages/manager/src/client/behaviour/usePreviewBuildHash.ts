import { useEffect, useState } from 'react';
import { assert } from '@storyshots/core';

export function usePreviewBuildHash(): string {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:6006');

    ws.addEventListener('message', (event) => {
      assert(typeof event.data === 'string');

      setHash(event.data);
    });

    return () => ws.close();
  }, []);

  return hash;
}
