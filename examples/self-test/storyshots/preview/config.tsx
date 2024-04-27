import { createPreviewApp } from '@storyshots/react-preview';
import { ConfigProvider } from 'antd';
import React from 'react';
import { App } from '../../../../packages/manager/src/client/App';
import { createExternalsMock, createJournaledExternals } from '../../src/mocks';

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
  ],
  presets: [],
  createExternals: createExternalsMock,
  createJournalExternals: createJournaledExternals,
});

const it = (title: Parameters<typeof _it>[0], config: RenderBoundConfig) =>
  _it(title, {
    ...config,
    render: (externals) => (
      <ConfigProvider theme={{ token: { motion: false } }}>
        <App externals={externals} />
      </ConfigProvider>
    ),
  });

type RenderBoundConfig = Omit<Parameters<typeof _it>[1], 'render'>;

export { run, it, describe };
