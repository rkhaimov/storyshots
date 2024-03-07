import React from 'react';
import { isNil } from '../../reusables/utils';
import { Placeholder } from './Placeholder';
import { ScreenshotReadyStory } from './ScreenshotReadyStory';
import { Story } from './Story';
import { Props } from './types';
import { useManagerState } from './useManagerState';

export const Preview: React.FC<Props> = (props) => {
  const { id, screenshotting, selectedPresets } = useManagerState(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  if (screenshotting) {
    return (
      <ScreenshotReadyStory
        id={id}
        {...props}
        selectedPresets={selectedPresets}
      />
    );
  }

  return <Story id={id} {...props} selectedPresets={selectedPresets} />;
};
