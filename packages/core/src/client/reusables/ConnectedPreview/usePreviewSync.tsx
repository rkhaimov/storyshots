import React, { useEffect } from 'react';
import { Preview } from './Preview';
import { PreviewConnectionProps } from './types';

export function usePreviewSync(
  props: PreviewConnectionProps,
): React.ComponentProps<typeof Preview> {
  useEffect(() => {
    window.onPreviewReady = (stories) => props.onPreviewLoaded(stories);
  }, [props]);

  return props;
}
