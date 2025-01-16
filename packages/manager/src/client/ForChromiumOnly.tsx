import { TestConfig, TreeOP } from '@storyshots/core';
import React from 'react';
import { RouteComponentProps } from 'wouter';
import { useSearch } from 'wouter/use-location';
import { Preview, usePreviewConnection } from './reusables/ConnectedPreview';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const preview = usePreviewConnection({
    config: {
      id: TreeOP.ensureIsLeafID(props.params.story),
      device: useSelectedDevice(),
      screenshotting: true,
    },
    onStateChange: () => {},
  });

  return <Preview {...preview} />;
};

function useSelectedDevice() {
  const search = useSearch();
  const params = new URLSearchParams(search);

  const config: Partial<TestConfig> | null = JSON.parse(
    params.get('config') ?? 'null',
  );

  return config?.device;
}
