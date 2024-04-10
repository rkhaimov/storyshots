import { ConfigProvider } from 'antd';
import {
  createDesktopDevice,
  createPreviewApp,
} from '@storyshots/react-preview';
import React from 'react';
import { App } from '../../../../packages/manager/src/client/App';
import {
  createExternalsDefaultMocks,
  createExternalsJournal,
} from '../../mocks';

const {
  run,
  it: _it,
  describe,
} = createPreviewApp({
  devices: {
    primary: createDesktopDevice('desktop', { width: 1480, height: 920 }),
    additional: [],
  },
  presets: [],
  createExternals: createExternalsDefaultMocks,
  createJournalExternals: createExternalsJournal,
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
