import { assert, Channel, PreviewState } from '@storyshots/core';
import React, { useEffect, useState } from 'react';
import { IPreview } from './types';

export const preview: IPreview = {
  usePreviewBuildHash: () => {
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
  },
  createPreviewConnection: (manager) =>
    new Promise<PreviewState>(
      (resolve) =>
        ((window as never as Channel).state = (preview) => {
          resolve(preview);

          return manager;
        }),
    ),
  Frame: (props) => <iframe {...props} />,
};
