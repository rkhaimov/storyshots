import { Channel, PreviewConfig, PreviewState } from '@storyshots/core';
import React, { useEffect } from 'react';

type Props = {
  key: string;
  config: PreviewConfig;
  onStateReceive(state: PreviewState): void;
};

export const DisposableFrame: React.FC<Props> = (props) => {
  useEffect(() => {
    createPreviewConnection(props.config).then(props.onStateReceive);
  }, []);

  return (
    <iframe
      id="preview"
      src={location.origin}
      style={{
        display: 'block',
        border: 'none',
        height: '100%',
        width: '100%',
      }}
    />
  );
};

function createPreviewConnection(manager: PreviewConfig) {
  return new Promise<PreviewState>(
    (resolve) =>
      ((window as never as Channel).state = (preview) => {
        resolve(preview);

        return manager;
      }),
  );
}
