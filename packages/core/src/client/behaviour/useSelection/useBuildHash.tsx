import { Brand } from '@core';
import { assert } from '@lib';
import { useEffect, useState } from 'react';
import { toManagerURL } from '../../../reusables/runner/toManagerURL';

export type PreviewBuildHash = Brand<string, 'PreviewBuildHash'> | undefined;

export function useBuildHash() {
  const [hash, setHash] = useState<PreviewBuildHash>();

  useEffect(() => {
    const ws = new WebSocket(toManagerURL(`ws://${location.host}`));

    ws.addEventListener('message', (event) => {
      assert(typeof event.data === 'string');

      setHash(event.data as PreviewBuildHash);
    });

    return () => ws.close();
  }, []);

  return hash;
}
