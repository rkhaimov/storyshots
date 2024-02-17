import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { StoryID } from '../../reusables/types';
import { Story } from './Story';
import { Props } from './types';

export const ScreenshotReadyStory: React.FC<{ id: StoryID } & Props> = (
  props,
) => {
  return props.renderScreenshotTimeEnv(
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
