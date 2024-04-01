import { assertNotEmpty, ManagerState, PreviewState } from '@storyshots/core';
import { createDesktopDevice } from '@storyshots/react-preview';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { IExternals } from '../../../packages/manager/src/client/externals/types';
import { App } from '../../../packages/preview/react/src/App';
import { describe, it } from '../../../packages/preview/react/src/factories';
import { ClientConfig, StoryTree } from '../../../packages/preview/react/src/types';

export const createPreviewHavingStories = (
  createConfig: (factories: Factories<null>) => StoryTree[],
) =>
  createPreviewHaving<null>((factories) => ({
    stories: createConfig(factories),
  }));

export const createPreviewHaving =
  <TExternals extends unknown>(createConfig: CreateConfig<TExternals>) =>
  (externals: IExternals) => {
    let channel:
      | undefined
      | { manager: ManagerState; onPreview(preview: PreviewState): void };

    const config = createConfig({ it, describe });

    return {
      ...externals,
      preview: {
        ...externals.preview,
        Frame: () => (
          <Delay>
            <App
              stories={config.stories ?? []}
              presets={config.presets ?? []}
              devices={config.devices ?? DEFAULT_DEVICES}
              externals={{ createManagerConnection }}
              createExternals={config.createExternals ?? (() => null)}
              createJournalExternals={
                config.createJournalExternals ?? ((externals) => externals)
              }
            />
          </Delay>
        ),
        createPreviewConnection,
      },
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
  };

const Delay: React.FC<PropsWithChildren> = ({ children }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDone(true), 0);

    return () => clearTimeout(id);
  }, []);

  if (done) {
    return children;
  }

  return null;
};

const DEFAULT_DEVICES = {
  primary: createDesktopDevice('desktop', {
    width: 1480,
    height: 920,
  }),
  additional: [],
};

type Factories<TExternals> = {
  it: typeof it<TExternals>;
  describe: typeof describe;
};

type CreateConfig<TExternals> = (
  factories: Factories<TExternals>,
) => Partial<ClientConfig<TExternals> & { stories: StoryTree[] }>;
