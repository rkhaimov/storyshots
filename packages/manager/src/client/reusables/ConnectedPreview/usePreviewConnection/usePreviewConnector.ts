import { ManagerState, PreviewState } from '@storyshots/core';
import { useEffect, useState } from 'react';
import { PreviewBuildHash } from '../types';

export function usePreviewConnector(
  hash: PreviewBuildHash,
  config: ManagerState,
) {
  const [state, setState] = useState<PreviewState>();
  const identity = `${JSON.stringify(config)}${hash}`;

  // Ignore race condition on purpose
  useEffect(
    () => void getConnectedPreviewState(config).then(setState),
    [identity],
  );

  return { identity, state };
}

function getConnectedPreviewState(config: ManagerState) {
  return new Promise<PreviewState>(
    (resolve) =>
      (window.onPreviewReady = (getState) => {
        resolve(getState(config));

        return config;
      }),
  );
}
