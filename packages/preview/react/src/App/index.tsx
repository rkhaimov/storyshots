import { assertNotEmpty, isNil } from '@storyshots/core';
import React from 'react';
import { createConfig } from './createConfig';
import { createExternals } from './createExternals';
import { find } from './find';
import { Placeholder } from './Placeholder';
import { CreateStoryViewProps } from './types';
import { createConnectToManager } from './usePreviewConfig';
import { View } from './View';

export const createStoryView = (props: CreateStoryViewProps) => {
  const { id, ...manager } = createConnectToManager(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  const story = find(id, props.stories);

  assertNotEmpty(story, 'Was not able to find a story, try to rerun');

  const config = createConfig(manager);
  const externals = createExternals(story, props, config);

  return <View story={story} config={config} externals={externals} />;
};
