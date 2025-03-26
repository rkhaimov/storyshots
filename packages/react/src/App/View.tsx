import { assertNotEmpty } from '@lib';
import { ActiveStory } from '@storyshots/core';
import React from 'react';

type Props = NonNullable<ActiveStory> & { externals: unknown };

export const View: React.FC<Props> = ({ story, externals, config }) => {
  assertNotEmpty(story.render, 'Render must be defined');

  return story.render(externals, config);
};
