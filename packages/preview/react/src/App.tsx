import { isNil } from '@storyshots/core';
import React from 'react';
import { Placeholder } from './Placeholder';
import { Story } from './Story';
import { PreviewProps } from './types';
import { usePreviewConfig } from './usePreviewConfig';

export const App: React.FC<PreviewProps> = (props) => {
  const { id, ...config } = usePreviewConfig(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  return <Story id={id} preview={props} config={config} />;
};
