import React from 'react';
import { MSWReplacer } from '@storyshots/msw-externals';
import { map } from '@storyshots/core';

import { stories } from '../stories';
import { run } from './config';
import { PureApp } from '../../src/PureApp';

void run(
  map(stories, (story) => ({
    render: (externals) => (
      <MSWReplacer endpoints={externals}>
        <PureApp />
      </MSWReplacer>
    ),
    ...story,
  })),
);
