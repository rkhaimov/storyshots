import { not } from '@storyshots/core';
import React from 'react';
import { AutoPlaySelection } from './behaviour/useAutoPlaySelection';
import { useExternals } from './externals/context';

type Props = {
  selection: AutoPlaySelection;
};

export const EmulatedPreviewFrame: React.FC<Props> = ({ selection }) => {
  const { preview } = useExternals();

  const hidden =
    selection.type === 'screenshot' || selection.type === 'records';

  const frame = (
    <preview.Frame id="preview" src={location.origin} hidden={hidden} />
  );

  if (selection.type === 'initializing' || hidden) {
    return frame;
  }

  const { device } = selection.config;

  if (not(device.emulated)) {
    return frame;
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div
        style={{
          height: device.config.height,
          width: device.config.width,
          margin: 'auto',
          border: '1px solid rgb(206, 206, 206)',
        }}
      >
        {frame}
      </div>
    </div>
  );
};
