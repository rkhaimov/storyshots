import { PreviewBuildHash } from './useBuildHash';
import { useEffect, useRef } from 'react';
import { PreviewConnectionProps } from '../types';
import { UntrustedPreviewState } from './usePreviewConnector';

export function usePreviewStateSyncEffect(
  hash: PreviewBuildHash,
  preview: UntrustedPreviewState,
  props: PreviewConnectionProps,
) {
  const onNextStateRef = useRef<NextStateRefHandler>(sync);

  useEffect(() => {
    onNextStateRef.current = sync;
  }, [hash]);

  useEffect(() => {
    onNextStateRef.current = onNextStateRef.current(preview, props);
  }, [preview]);
}

type NextStateRefHandler = (
  state: UntrustedPreviewState,
  props: PreviewConnectionProps,
) => NextStateRefHandler;

const sync: NextStateRefHandler = (state, props) => {
  if (state === undefined) {
    return sync;
  }

  props.onStateChange(state);

  return idle;
};

const idle: NextStateRefHandler = () => idle;
