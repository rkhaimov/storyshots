import { assert, Channel, PreviewState } from '@storyshots/core';
import React, { useEffect, useState } from 'react';
import { createManagerRequest } from '../../../reusables/createManagerRequest';
import { IPreview } from './types';

export const preview: IPreview = {
  usePreviewBuildHash: () => {
    const [hash, setHash] = useState('');

    useEffect(() => {
      const ws = new WebSocket(createManagerRequest(`ws://${location.host}`));

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
  Frame: ({ id, src, hidden }) => (
    <iframe
      id={id}
      src={src}
      style={{
        display: 'block',
        height: hidden ? 0 : '100%',
        width: hidden ? 0 : '100%',
        border: 'none',
      }}
    />
  ),
};
