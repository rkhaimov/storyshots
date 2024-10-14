import { PreviewFrameProps } from './types';
import React, { useEffect, useState } from 'react';
import { DisposableFrame } from './DisposableFrame';
import { createManagerRequest } from '../../../reusables/createManagerRequest';
import { assert } from '@storyshots/core';

export function createOnStateChangeHook() {
  let last: string | undefined = undefined;

  return (props: PreviewFrameProps): Props => {
    const hash = usePreviewBuildHash();

    return {
      key: hash,
      onStateReceive: (state) => {
        if (hash === last) {
          return;
        }

        last = hash;

        props.onStateChange(state);
      },
    };
  };
}

type Props = Pick<
  React.ComponentProps<typeof DisposableFrame>,
  'onStateReceive' | 'key'
>;

function usePreviewBuildHash() {
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
}
