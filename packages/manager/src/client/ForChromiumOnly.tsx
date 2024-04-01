import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';
import { useExternals } from './externals/context';
import { Story } from './Story';
import { useSearch } from 'wouter/use-location';
import { TreeOP } from '@storyshots/core';
import { SelectedPresets } from '@storyshots/core';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const { preview } = useExternals();
  const search = useSearch();

  useMemo(() => {
    const params = new URLSearchParams(search);

    const presets: SelectedPresets = JSON.parse(
      params.get('presets') ?? 'null',
    );

    preview.createPreviewConnection({
      id: TreeOP.ensureIsLeafID(props.params.story),
      screenshotting: true,
      presets,
    });
  }, []);

  return <Story hidden={false} />;
};
