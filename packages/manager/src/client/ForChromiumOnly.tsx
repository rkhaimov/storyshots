import { assertNotEmpty, Device, StoryID } from '@storyshots/core';
import React from 'react';
import { RouteComponentProps, useSearchParams } from 'wouter';
import { Preview, usePreviewConnection } from './reusables/ConnectedPreview';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const [params] = useSearchParams();

  const preview = usePreviewConnection({
    state: {
      id: props.params.story as StoryID,
      devices: getRequiredValue<Device[]>(params, 'devices'),
      device: getRequiredValue<Device>(params, 'device'),
      testing: true,
    },
    onPreviewLoaded: () => {},
  });

  return <Preview {...preview} />;
};

// TODO: Duplication with useManagerConfig
function getRequiredValue<T>(params: URLSearchParams, key: string): T {
  const value = params.get(key);

  assertNotEmpty(value, `Expected ${key} to be defined in query`);

  return JSON.parse(value) as T;
}
