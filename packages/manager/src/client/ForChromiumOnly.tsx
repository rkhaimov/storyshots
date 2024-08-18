import { TestConfig, TreeOP } from '@storyshots/core';
import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';
import { useSearch } from 'wouter/use-location';
import { useExternals } from './externals/context';
import { PreviewFrame } from './PreviewFrame';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const { preview } = useExternals();
  const search = useSearch();

  useMemo(() => {
    const params = new URLSearchParams(search);

    const config: Partial<TestConfig> | null = JSON.parse(
      params.get('config') ?? 'null',
    );

    preview.createPreviewConnection({
      id: TreeOP.ensureIsLeafID(props.params.story),
      screenshotting: true,
      presets: config?.presets ?? {},
      device: config?.device,
    });
  }, []);

  return <PreviewFrame hidden={false} />;
};
