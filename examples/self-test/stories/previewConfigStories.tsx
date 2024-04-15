import { finder } from '@storyshots/react-preview';
import React from 'react';
import {
  openGroup,
  openScreenshot,
  runStoryOrGroup,
  selectStory,
} from '../reusables/actor-transformers';
import { arranger } from '../arranger';
import { createStoriesStub } from '../arranger/createStoriesStub';
import { describe, it } from '../storyshots/preview/config';

export const previewConfigStories = describe('PreviewConfig', [
  it('allows to select preview device mode', {
    arrange: setup()
      .stories((f) =>
        createStoriesStub(f, () =>
          f.it('in general are small', {
            render: () =>
              navigator.userAgent.includes('iphone') ? (
                <h1>Image showing that cats are small on mobile</h1>
              ) : (
                <h1>Image showing that cats are small on desktop</h1>
              ),
          }),
        ),
      )
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(selectStory('in general are small'))
        .click(finder.getByRole('button', { name: 'Toggle config pane' }))
        .screenshot('Pane')
        .click(finder.getByText('desktop'))
        .screenshot('Options')
        .click(finder.getByText('mobile').at(1))
        .screenshot('MobileSelected')
        .click(finder.getByText('Apply to preview')),
  }),
  it('runs by default only selected device', {
    arrange: setup().stories(createStoriesStub).build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .click(finder.getByRole('button', { name: 'Toggle config pane' }))
        .click(finder.getByText('desktop'))
        .click(finder.getByText('mobile').at(1))
        .click(finder.getByText('Apply to preview'))
        .do(runStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL')),
  }),
]);

function setup() {
  return arranger().config((config) => ({
    ...config,
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
          userAgent: 'iphone',
          width: 414,
          height: 896,
        },
      },
    ],
  }));
}
