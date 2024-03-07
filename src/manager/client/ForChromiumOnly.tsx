import React, { useMemo } from 'react';
import { RouteComponentProps } from 'wouter';
import { TreeOP } from '../../reusables/tree';
import { Story } from './Story';
import { useSearch } from 'wouter/use-location';
import { isNil } from '../../reusables/utils';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const search = useSearch();

  useMemo(() => {
    const params = new URLSearchParams(search);
    const presetsParam = params.get('presets');
    const presets = isNil(presetsParam)
      ? {}
      : (JSON.parse(presetsParam) as SelectedPresets);

    window.setAppConfigAndGetState = () => ({
      id: TreeOP.ensureIsLeafID(props.params.story),
      screenshotting: true,
      selectedPresets: presets,
    });
  }, []);

  return <Story hidden={false} />;
};
