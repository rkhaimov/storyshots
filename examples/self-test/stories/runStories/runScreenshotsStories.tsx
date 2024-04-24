import { finder } from '@storyshots/core';
import React from 'react';
import {
  acceptActiveRecordOrScreenshot,
  openGroup,
  openScreenshot,
  runStoryOrGroup,
} from '../../reusables/actor-transformers';
import { arranger } from '../../arranger';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { fromActionsToScreenshots } from '../../mocks/screenshot';
import { describe, it } from '../../storyshots/preview/config';

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
        .do(runStoryOrGroup('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('Additional'))
        .screenshot('Preview')
        .do(acceptActiveRecordOrScreenshot()),
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
        .do(runStoryOrGroup('in general are small'))
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
        .do(runStoryOrGroup('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('FINAL'))
        .screenshot('2UP')
        .click(finder.getByRole('LabelText').has(finder.getByText('Swipe')))
        .screenshot('Onion')
        .do(acceptActiveRecordOrScreenshot()),
  }),
]);

