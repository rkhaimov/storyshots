import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';
import { Story } from './Story';
import { useSearch } from 'wouter/use-location';
import { createPreviewConnection, TreeOP } from '@storyshots/core';
import { SelectedPresets } from '@storyshots/core';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const search = useSearch();

  useMemo(() => {
    const params = new URLSearchParams(search);

    const presets: SelectedPresets = JSON.parse(
      params.get('presets') ?? 'null',
    );

    createPreviewConnection({
      id: TreeOP.ensureIsLeafID(props.params.story),
      screenshotting: true,
      presets,
    });
  }, []);

  return <Story hidden={false} />;
};
