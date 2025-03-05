import { useState } from 'react';
import { PreviewState } from '@storyshots/core';
import {
  PreviewBuildHash,
  PreviewConnectionProps,
} from '../../reusables/ConnectedPreview/types';

type State = {
  hash: PreviewBuildHash;
  preview: PreviewState;
};

export function usePreviewState() {
  const [state, setState] = useState<State>();

  const onPreviewLoaded: PreviewConnectionProps['onPreviewLoaded'] = (
    preview,
    hash,
  ) => {
    if (state !== undefined && state?.hash === hash) {
      return;
    }

    setState({ hash, preview });
  };

  return {
    preview: state?.preview,
    onPreviewLoaded,
  };
}
