import { isNil } from '@storyshots/core';
import React, { useEffect } from 'react';
import { Placeholder } from './Placeholder';
import { Story } from './Story';
import { Props } from './types';
import { useManagerState } from './useManagerState';

export const App: React.FC<Props> = (props) => {
  const { id, screenshotting, presets, device } = useManagerState(props);

  useEffect(() => {
    if (isNil(device)) {
      return;
    }

    if (device.type === 'size-only') {
      return;
    }

    try {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => device.config.userAgent,
      });
    } catch (e) { /* empty */ }
  }, [device]);

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
