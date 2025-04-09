import '../externals/install';

import React from 'react';
import { map } from '@storyshots/core';

import { PureApp } from '../../PureApp';
import { run } from './config';
import { stories } from '../stories';

void run(
  map(stories, (story) => ({
    render: (externals) => <PureApp externals={externals} />,
    ...story,
  })),
);
