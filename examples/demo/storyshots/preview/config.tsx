import { not } from '../../../../packages/core/src';
import {
  createDesktopDevice,
  createMobileDevice,
  createPreviewApp,
} from '../../../../packages/preview/react/src';
import React from 'react';
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
      default: 'Light',
      additional: [
        {
          name: 'Dark',
          configure: (externals) => ({
            ...externals,
            options: {
              ...externals.options,
              getTheme: () => 'dark',
            },
          }),
        },
      ],
    },
  ],
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});

const it = (title: Parameters<typeof _it>[0], config: RenderBoundConfig) =>
  _it(title, {
    ...config,
    render: (externals, screenshotting) => (
      <PureApp
        externals={externals}
        theme={{ token: { motion: not(screenshotting) } }}
      />
    ),
  });

type RenderBoundConfig = Omit<Parameters<typeof _it>[1], 'render'>;

export { run, it, describe };
