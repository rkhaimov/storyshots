import { isNil } from '@storyshots/core';
import React from 'react';
import { Placeholder } from './Placeholder';
import { Story } from './Story';
import { PreviewProps } from './types';
import { useManagerState } from './useManagerState';

export const App: React.FC<PreviewProps> = (props) => {
  const { id, ...state } = useManagerState(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  return <Story id={id} preview={props} state={state} />;
};
