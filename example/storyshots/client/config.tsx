import React from 'react';
import {
  createJournalExternals,
  createMockExternals,
} from '../../externals/createMockExternals';
import { createConfigureClient } from '../../../src/client/create-configure-client';
import { PureApp } from '../../PureApp';

const {
  run,
  createStory: _createStory,
  createGroup,
} = createConfigureClient({
  modes: {
    primary: {
      type: 'viewport',
      id: 'desktop',
      viewport: {
        width: 1480,
        height: 920,
      },
    },
    additional: [
      {
        type: 'viewport',
        id: 'desktopXL',
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
      // https://github.com/puppeteer/puppeteer/blob/197f00547ea402118c7db3cfaa4a57eb0efdd4cc/packages/puppeteer-core/src/common/Device.ts#L17
      {
        type: 'device',
        id: 'mobile',
        device: {
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
          viewport: {
            width: 414,
            height: 896,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
          },
        },
      },
    ],
  },
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});

const createStory = (config: RenderBoundConfig) =>
  _createStory({
    ...config,
    render: (externals) => <PureApp externals={externals} />,
  });

type RenderBoundConfig = Omit<Parameters<typeof _createStory>[0], 'render'>;

export { run, createStory, createGroup };
