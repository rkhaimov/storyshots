import React from 'react';
import {
  createJournalExternals,
  createMockExternals,
} from '../externals/createMockExternals';
import { createConfigureClient } from '../../src/client/create-configure-client';
import { PureApp } from '../PureApp';

const {
  run,
  createStory: _createStory,
  createGroup,
} = createConfigureClient({
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
