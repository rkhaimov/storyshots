import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { ManagerState, StoryID } from '@storyshots/core';
import { Story } from './Story';
import { Props } from './types';

export const ScreenshottingStory: React.FC<
  { id: StoryID } & ManagerState & { config: Props }
> = (props) => {
  return props.config.renderScreenshotTimeEnv(
    <>
      <AllCssInconsistenciesDisabled />
      <Story {...props} />
    </>,
  );
};

const AllCssInconsistenciesDisabled = createGlobalStyle`
  *,
  *::after,
  *::before {
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    animation-delay: -0.0001s !important;
    animation-duration: 0s !important;
    animation-play-state: paused !important;
    caret-color: transparent !important;
    color-adjust: exact !important;
  }
`;
