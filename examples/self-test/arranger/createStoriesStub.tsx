import { StoryTree } from '@storyshots/react-preview/lib/types';
import React from 'react';
import { Factories } from './types';

export function createStoriesStub<TExternals>(
  f: Factories<TExternals>,
  createCustom = () =>
    f.it('in general are small', {
      render: () => <h1>Image showing that cats are small</h1>,
    }),
): StoryTree[] {
  return [
    f.it('pets are great', {
      render: () => <p>Some facts proving this statement</p>,
    }),
    f.describe('Cats', [
      createCustom(),
      f.describe('Daily', [
        f.it('during day cats love to play around', {
          render: () => <h1>Cats playground</h1>,
        }),
      ]),
      f.describe('Nightly', []),
    ]),
    f.describe('Dogs', [
      f.it('loves to play with toys', {
        render: () => <h1>Dogs playground</h1>,
      }),
    ]),
  ];
}
