import { ManagerState, PreviewState } from '@storyshots/core';
import React, { useEffect } from 'react';
import { Preview } from '../Preview';
import { PreviewConnectionProps } from '../types';
import { useBuildHash } from './useBuildHash';

/**
 * Creates a connection between manager and preview.
 *
 * @returns Identity of the preview.
 */
export function usePreviewConnection(
  props: PreviewConnectionProps,
): React.ComponentProps<typeof Preview> {
  const hash = useBuildHash();

  // Represents comparable preview arguments
  const identity = `${JSON.stringify(props.state)}${hash}`;

  // Ignore race condition on purpose
  useEffect(
    () =>
      void getConnectedPreviewState(props.state).then((preview) =>
        props.onPreviewLoaded(preview, hash),
      ),
    [identity],
  );

  return { identity };
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
