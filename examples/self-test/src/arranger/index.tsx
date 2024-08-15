import { ClientConfig } from '@storyshots/react-preview/lib/types';
import React, { memo } from 'react';
import { IWebDriver } from '../../../../packages/manager/src/reusables/types';
import { describe, it } from '../../../../packages/preview/react/src/factories';
import { shouldNeverBeCalled } from '../reusables/shouldNeverBeCalled';
import { createChannelHandler } from './createChannelHandler';
import { createRecordsHandler } from './createRecordsHandler';
import { IFrameEmulatedPreview } from './IFrameEmulatedPreview';
import { Arranger, Props, StoryFactory } from './types';

export function arranger<TExternals = null>() {
  let createStories: StoryFactory<TExternals> = () => [];
  let onConfig = (config: ClientConfig<TExternals>) => config;
  let onDriver = (driver: IWebDriver) => driver;

  const arranger: Arranger<TExternals> = {
    stories: (create) => {
      createStories = create;

      return arranger;
    },
    config: (transform) => {
      const prev = onConfig;

      onConfig = (config) => transform(prev(config));

      return arranger;
    },
    driver: (transform) => {
      const prev = onDriver;

      onDriver = (driver) => transform(prev(driver));

      return arranger;
    },
    build: () => (_externals) => {
      const records = createRecordsHandler();
      const channel = createChannelHandler();
      const externals = channel.onExternals(records.onExternals(_externals));
      const props = channel.onPreviewProps(
        records.onPreviewProps(createProps()),
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

  function createProps(): Props {
    return {
      stories: createStories({ it, describe }),
      externals: {
        createManagerConnection: shouldNeverBeCalled,
        setRecordsSource: shouldNeverBeCalled,
      },
      ...onConfig({
        retries: 0,
        presets: [],
        devices: [
          {
            type: 'size-only',
            name: 'desktop',
            config: { width: 1480, height: 920 },
          },
        ],
        createExternals: () => null as TExternals,
        createJournalExternals: (externals) => externals,
      }),
    };
  }

  return arranger;
}
