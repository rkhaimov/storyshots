import { PreviewConnectionProps } from '../types';
import React from 'react';
import { Preview } from '../Preview';
import { useBuildHash } from './useBuildHash';
import { usePreviewStateSyncEffect } from './usePreviewStateSyncEffect';
import { usePreviewConnector } from './usePreviewConnector';

export function usePreviewConnection(
  props: PreviewConnectionProps,
): React.ComponentProps<typeof Preview> {
  const hash = useBuildHash();
  const { identity, state } = usePreviewConnector(hash, props.config);

  usePreviewStateSyncEffect(hash, state, props);

  return { identity };
}
