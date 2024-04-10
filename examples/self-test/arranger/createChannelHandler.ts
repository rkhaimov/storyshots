import { assertNotEmpty, ManagerState, PreviewState } from '@storyshots/core';
import React from 'react';
import { IExternals } from '../../../packages/manager/src/client/externals/types';
import type { App } from '../../../packages/preview/react/src/App';

export function createChannelHandler() {
  let channel:
    | undefined
    | { manager: ManagerState; onPreview(preview: PreviewState): void };

  return {
    onExternals: (externals: IExternals): IExternals => ({
      ...externals,
      preview: {
        ...externals.preview,
        createPreviewConnection,
      },
    }),
    onPreviewProps: (
      props: React.ComponentProps<typeof App>,
    ): React.ComponentProps<typeof App> => ({
      ...props,
      externals: {
        ...props.externals,
        createManagerConnection,
      },
    }),
  };

  function createPreviewConnection(
    manager: ManagerState,
  ): Promise<PreviewState> {
    return new Promise<PreviewState>((resolve) => {
      channel = {
        manager,
        onPreview: resolve,
      };
    });
  }

  function createManagerConnection(preview: PreviewState): ManagerState {
    assertNotEmpty(channel);

    channel.onPreview(preview);

    return channel.manager;
  }
}
