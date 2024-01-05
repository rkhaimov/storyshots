import React from 'react';
import { Counter } from './index';
import { createGroup, createStory } from '../../src/client';

export const counterStories = createGroup('Counter', [
  createStory({
    title: 'Default',
    render: () => <Counter />,
  }),
  createStory({
    title: 'Increment',
    act: (actor, finder) =>
      actor.click(finder.getByRole('button', { name: 'Increment' })),
    render: () => <Counter />,
  }),
]);
