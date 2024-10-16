import React from 'react';
import { PreviewFrameProps } from './types';
import { DisposableFrame } from './DisposableFrame';
import { createOnStateChangeHook } from './createOnStateChangeHook';

export function createPreviewFrame(): React.FC<PreviewFrameProps> {
  const useDisposableFrameProps = createDisposableFramePropsHook();

  return (props) => <DisposableFrame {...useDisposableFrameProps(props)} />;
}

function createDisposableFramePropsHook() {
  const useOnStateChange = createOnStateChangeHook();

  return (
    props: PreviewFrameProps,
  ): React.ComponentProps<typeof DisposableFrame> => {
    const { key, onStateReceive } = useOnStateChange(props);

    return {
      key: `${JSON.stringify(props.config)}${key}`,
      config: props.config,
      onStateReceive,
    };
  };
}
