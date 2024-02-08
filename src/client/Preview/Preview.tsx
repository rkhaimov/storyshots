import React from 'react';
import { isNil } from '../../reusables/utils';
import { Placeholder } from './Placeholder';
import { ScreenshotReadyStory } from './ScreenshotReadyStory';
import { Story } from './Story';
import { Props } from './types';

export const Preview: React.FC<Props> = (props) => {
  if (isNil(props.story)) {
    return <Placeholder />;
  }

  if (props.screenshotting) {
    return <ScreenshotReadyStory id={props.story} {...props} />;
  }

  return <Story id={props.story} {...props} />;
};

