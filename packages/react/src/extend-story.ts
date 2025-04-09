import { StoryConfig } from '@storyshots/core';
import React from 'react';

declare module '@storyshots/core' {
  interface StoryAttributes<TExternals> {
    render?(externals: TExternals, config: StoryConfig): React.ReactNode;
  }
}
