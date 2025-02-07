import { MSWReplacer, native } from '@storyshots/msw-externals';
import { createPreviewApp } from '@storyshots/react-preview';
import { HttpResponse } from 'msw';
import React from 'react';
import { PureApp } from '../../src/PureApp';
import {
  createJournalExternals,
  createMockExternals,
  Externals,
} from '../externals';

const {
  run,
  it: _it,
  describe,
} = createPreviewApp<Externals>({
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
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});

const it = (title: Parameters<typeof _it>[0], config: RenderBoundConfig) =>
  _it(title, {
    ...config,
    render: (externals) => (
      <MSWReplacer
        endpoints={externals.endpoints}
        onUnknownEndpoint={() =>
          native(new HttpResponse(null, { status: 404 }))
        }
      >
        <PureApp />
      </MSWReplacer>
    ),
  });

type RenderBoundConfig = Omit<Parameters<typeof _it>[1], 'render'>;

export { run, it, describe };
