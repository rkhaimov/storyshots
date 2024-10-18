import { Channel, PreviewConfig, PreviewState } from '@storyshots/core';
import { useEffect, useState } from 'react';
import { PreviewBuildHash } from './useBuildHash';

// Defines connected preview internal and external states according to content hash and config
export function usePreviewConnector(
  hash: PreviewBuildHash,
  config: PreviewConfig,
) {
  const [state, setState] = useState<UntrustedPreviewState>();
  const identity = `${JSON.stringify(config)}${hash}`;

  useEffect(() => {
    // Ignore race condition on purpose
    getConnectedPreviewState(config).then(setState);
  }, [identity]);

  return { identity, state };
}

function getConnectedPreviewState(config: PreviewConfig) {
  return new Promise<PreviewState>(
    (resolve) =>
      ((window as never as Channel).state = (preview) => {
        resolve(preview);

        return config;
      }),
  );
}

export type UntrustedPreviewState = PreviewState | undefined;
