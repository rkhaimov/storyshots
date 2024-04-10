import { ActorTransformer, finder } from '@storyshots/react-preview';
import React from 'react';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { fromActionsToScreenshots } from '../../mocks/screenshot';
import { describe, it } from '../../storyshots/preview/config';
import { arranger } from '../../arranger';
import { accept, openGroup, runStory } from '../../actor-transformers';

export const runScreenshotsStories = describe('Screenshots', [
  it('captures all user defined screenshots', {
    arrange: arranger()
      .stories((f) =>
        createStoriesStub(f, () =>
          f.it('in general are small', {
            act: (actor) => actor.screenshot('Additional'),
            render: () => <h1>Feeding pets page</h1>,
          }),
        ),
      )
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStory('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('Additional'))
        .screenshot('Preview')
        .do(accept()),
  }),
  it('compares screenshots when they have equal baseline', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => ({
        ...driver,
        areScreenshotsEqual: async () => true,
        getExpectedScreenshots: async (at, payload) =>
          fromActionsToScreenshots(at, payload, 'expected'),
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStory('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('FINAL')),
  }),
  it('shows the difference with baseline', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => ({
        ...driver,
        areScreenshotsEqual: async () => false,
        getExpectedScreenshots: async (at, payload) =>
          fromActionsToScreenshots(at, payload, 'expected'),
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStory('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('FINAL'))
        .screenshot('2UP')
        .click(finder.getByRole('LabelText').has(finder.getByText('Swipe')))
        .screenshot('Onion')
        .do(accept()),
  }),
]);

const openScreenshot =
  (name: string): ActorTransformer =>
  (actor) =>
    actor.click(finder.getByRole('menuitem', { name }));
