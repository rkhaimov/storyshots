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
