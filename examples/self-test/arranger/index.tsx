import { createDesktopDevice } from '@storyshots/react-preview';
import React, { memo } from 'react';
import { IWebDriver } from '../../../packages/manager/src/reusables/types';
import type { App } from '../../../packages/preview/react/src/App';
import { describe, it } from '../../../packages/preview/react/src/factories';
import { ClientConfig } from '../../../packages/preview/react/src/types';
import { shouldNeverBeCalled } from '../reusables/shouldNeverBeCalled';
import { createChannelHandler } from './createChannelHandler';
import { createRecordsHandler } from './createRecordsHandler';
import { IFrameEmulatedPreview } from './IFrameEmulatedPreview';
import { Arranger, StoryFactory } from './types';

export function arranger<TExternals = null>() {
  let createStories: StoryFactory<TExternals> = () => [];
  let config: Partial<ClientConfig<TExternals>> = {};
  let onDriver = (driver: IWebDriver) => driver;

  const arranger: Arranger<TExternals> = {
    stories: (create) => {
      createStories = create;

      return arranger;
    },
    config: (_config) => {
      config = _config;

      return arranger;
    },
    driver: (transform) => {
      onDriver = transform;

      return arranger;
    },
    build: () => (_externals) => {
      const records = createRecordsHandler();
      const channel = createChannelHandler();
      const externals = channel.onExternals(records.onExternals(_externals));
      const props = channel.onPreviewProps(
        records.onPreviewProps(createDefaultProps()),
      );

      return {
        ...externals,
        driver: onDriver(externals.driver),
        preview: {
          ...externals.preview,
          // eslint-disable-next-line react/display-name
          Frame: memo(({ hidden }) => (
            <IFrameEmulatedPreview hidden={hidden} {...props} />
          )),
        },
      };
    },
  };

  function createDefaultProps(): React.ComponentProps<typeof App> {
    return {
      stories: createStories({ it, describe }),
      presets: config.presets ?? [],
      devices: config.devices ?? {
        primary: createDesktopDevice('desktop', {
          width: 1480,
          height: 920,
        }),
        additional: [],
      },
      externals: {
        createManagerConnection: shouldNeverBeCalled,
        setRecordsSource: shouldNeverBeCalled,
      },
      createExternals: config.createExternals ?? (() => null),
      createJournalExternals:
        config.createJournalExternals ?? ((externals) => externals),
    };
  }

  return arranger;
}
