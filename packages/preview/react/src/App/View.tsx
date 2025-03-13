import { StoryConfig } from '@storyshots/core';
import React from 'react';
import { Story } from '../tree/it';

type Props = { story: Story; externals: unknown; config: StoryConfig };

export const View: React.FC<Props> = ({ story, externals, config }) =>
  story.payload.render(externals, config);
