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
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});

const it = (title: Parameters<typeof _it>[0], config: RenderBoundConfig) =>
  _it(title, {
    ...config,
    render: (externals) => <PureApp externals={externals} />,
  });

type RenderBoundConfig = Omit<Parameters<typeof _it>[1], 'render'>;

export { run, it, describe };
