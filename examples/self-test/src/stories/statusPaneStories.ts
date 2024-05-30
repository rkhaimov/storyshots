import { finder, StoryID } from '@storyshots/core';
import { ActionsAndConfig } from '@storyshots/manager/lib/reusables/types';
import { describe, it } from '../../storyshots/preview/config';
import { arranger } from '../arranger';
import { createStoriesStub } from '../arranger/createStoriesStub';
import { fromActionsToScreenshots } from '../mocks/screenshot';
import { openGroup } from '../reusables/actor-transformers';

export const statusPaneStories = describe('StatusPane', [
  it('allows to examine error descriptions', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => ({
        ...driver,
        actOnServerSide: async (at) => ({
          type: 'error',
          message: `Error has been occurred running ${at}`,
        }),
      }))
      .build(),
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Run' }))
        .click(finder.getByRole('link', { name: 'Status' }))
        .screenshot('PanelOpened')
        .click(
          finder
            .getByRole('list', { name: 'Errors' })
            .getByRole('listitem', { name: 'in general are small' }),
        )
        .screenshot('StoryErrorSelected'),
  }),
  it('allows to see all failed stories', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => ({
        ...driver,
        getExpectedRecords: async () => [{ method: 'unknown', args: [] }],
        areScreenshotsEqual: async () => false,
        getExpectedScreenshots: async (at, payload) =>
          fromActionsToScreenshots(at, payload, 'expected'),
      }))
      .build(),
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Run' }))
        .click(finder.getByRole('link', { name: 'Status' }))
        .click(finder.getByText('Failures'))
        .screenshot('PanelOpened')
        .click(
          finder
            .getByRole('list', { name: 'Failures' })
            .getByRole('listitem', { name: 'in general are small' }),
        )
        .screenshot('StoryErrorSelected'),
  }),
]);
