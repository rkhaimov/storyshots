import { ConfigProvider } from 'antd';
import React from 'react';
import {
  createDesktopDevice,
  createMobileDevice,
  createPreviewApp,
} from '@storyshots/react-preview';
import {
  createJournalExternals,
  createMockExternals,
} from '../../externals/createMockExternals';
import { PureApp } from '../../PureApp';

const {
  run,
  it: _it,
  describe,
} = createPreviewApp({
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
  presets: [
    {
      name: 'Theme',
      default: {
        name: 'Light',
        prepare: (externals) => externals,
      },
      additional: [
        {
          name: 'Dark',
          prepare: (externals) => {
            return {
              ...externals,
              options: {
                ...externals.options,
                getTheme: () => 'dark',
              },
            };
          },
        },
      ],
    },
  ],
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
  renderScreenshotTimeEnv: (app) => (
    <ConfigProvider theme={{ token: { motion: false } }}>{app}</ConfigProvider>
  ),
});

const it = (title: Parameters<typeof _it>[0], config: RenderBoundConfig) =>
  _it(title, {
    ...config,
    render: (externals) => <PureApp externals={externals} />,
  });

type RenderBoundConfig = Omit<Parameters<typeof _it>[1], 'render'>;

export { run, it, describe };
