import { createPreviewApp } from '@storyshots/react-preview';
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
  devices: [
    {
      type: 'size-only',
      name: 'desktop',
      config: { width: 1480, height: 920 },
    },
    {
      type: 'emulated',
      name: 'mobile',
      config: {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        width: 414,
        height: 896,
        deviceScaleFactor: 3,
      },
    },
  ],
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
        theme={{ token: { motion: !screenshotting } }}
      />
    ),
  });

type RenderBoundConfig = Omit<Parameters<typeof _it>[1], 'render'>;

export { run, it, describe };
