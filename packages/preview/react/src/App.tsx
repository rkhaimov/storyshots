import { isNil } from '@storyshots/core';
import React from 'react';
import { Placeholder } from './Placeholder';
import { Story } from './Story';
import { Props } from './types';
import { useManagerState } from './useManagerState';

export const App: React.FC<Props> = (props) => {
  const { id, screenshotting, presets } = useManagerState(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  return (
    <Story
      id={id}
      screenshotting={screenshotting}
      presets={presets}
      config={props}
    />
  );
};
