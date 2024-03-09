import React from 'react';
import { isNil } from '@storyshots/core';
import { Placeholder } from './Placeholder';
import { ScreenshottingStory } from './ScreenshottingStory';
import { Story } from './Story';
import { Props } from './types';
import { useManagerState } from './useManagerState';

export const Preview: React.FC<Props> = (props) => {
  const { id, screenshotting, presets } = useManagerState(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  if (screenshotting) {
    return (
      <ScreenshottingStory
        id={id}
        screenshotting={screenshotting}
        presets={presets}
        config={props}
      />
    );
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
