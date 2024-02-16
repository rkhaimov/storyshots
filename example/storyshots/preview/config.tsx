import { ConfigProvider } from 'antd';
import React from 'react';
import {
  createJournalExternals,
  createMockExternals,
} from '../../externals/createMockExternals';
import {
  createConfigurePreview,
  createDesktopDevice,
  createMobileDevice,
} from '../../../src/client';
import { PureApp } from '../../PureApp';

const {
  runPreview,
  createStory: _createStory,
  createGroup,
} = createConfigurePreview({
  devices: {
    primary: createDesktopDevice('desktop', {
      width: 1480,
      height: 920,
    }),
    additional: [
      createDesktopDevice('desktopXL', {
        width: 1920,
        height: 1080,
      }),
      createMobileDevice('mobile', {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        width: 414,
        height: 896,
        deviceScaleFactor: 3,
      }),
    ],
  },
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
  renderScreenshotTimeEnv: (app) => (
    <ConfigProvider theme={{ token: { motion: false } }}>{app}</ConfigProvider>
  ),
});

const createStory = (config: RenderBoundConfig) =>
  _createStory({
    ...config,
    render: (externals) => <PureApp externals={externals} />,
  });

type RenderBoundConfig = Omit<Parameters<typeof _createStory>[0], 'render'>;

export { runPreview, createStory, createGroup };
