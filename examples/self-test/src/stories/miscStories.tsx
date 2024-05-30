import { describe, it } from '../../storyshots/preview/config';
import { arranger } from '../arranger';
import { createStoriesStub } from '../arranger/createStoriesStub';
import { fromActionsToScreenshots } from '../mocks/screenshot';
import {
  openGroup,
  openScreenshot,
  runStoryOrGroup,
} from '../reusables/actor-transformers';

export const miscStories = describe('Misc', [
  it('spinner on screenshots allows clicking menu', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => {
        let called = false;

        return {
          ...driver,
          actOnServerSide: (at, payload) => {
            if (called) {
              return new Promise(() => {});
            }

            called = true;

            return driver.actOnServerSide(at, payload);
          },
        };
      })
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runStoryOrGroup('in general are small'))
        .do(openScreenshot('FINAL'))
        .do(runStoryOrGroup('in general are small')),
  }),
  describe('StatusPropagation', [
    it('fresh is shown even when not all are done', {
      arrange: arranger()
        .stories(createStoriesStub)
        .driver((driver) => ({
          ...driver,
          actOnServerSide: async (at, payload) => {
            if (at === 'cats__daily__during_day_cats_love_to_play_around') {
              return new Promise<never>(() => {});
            }

            return driver.actOnServerSide(at, payload);
          },
        }))
        .build(),
      act: (actor) =>
        actor
          .do(openGroup('Cats'))
          .do(openGroup('Daily'))
          .do(openGroup('Dogs'))
          .do(runStoryOrGroup('Cats')),
    }),
    it('failure is shown even when not all are done', {
      arrange: arranger()
        .stories(createStoriesStub)
        .driver((driver) => ({
          ...driver,
          actOnServerSide: async (at, payload) => {
            if (at === 'cats__daily__during_day_cats_love_to_play_around') {
              return new Promise<never>(() => {});
            }

            return driver.actOnServerSide(at, payload);
          },
          getExpectedScreenshots: async (at, payload) =>
            fromActionsToScreenshots(at, payload, 'expected'),
          areScreenshotsEqual: async () => false,
        }))
        .build(),
      act: (actor) =>
        actor
          .do(openGroup('Cats'))
          .do(openGroup('Daily'))
          .do(openGroup('Dogs'))
          .do(runStoryOrGroup('Cats')),
    }),
    it('error is shown even when not all are done', {
      arrange: arranger()
        .stories(createStoriesStub)
        .driver((driver) => ({
          ...driver,
          actOnServerSide: async (at) => {
            if (at === 'cats__daily__during_day_cats_love_to_play_around') {
              return new Promise<never>(() => {});
            }

            return { type: 'error', message: 'Error has been caught' };
          },
        }))
        .build(),
      act: (actor) =>
        actor
          .do(openGroup('Cats'))
          .do(openGroup('Daily'))
          .do(openGroup('Dogs'))
          .do(runStoryOrGroup('Cats')),
    }),
    it('checkmark is not shown until all running are done', {
      arrange: arranger()
        .stories(createStoriesStub)
        .driver((driver) => ({
          ...driver,
          actOnServerSide: async (at, payload) => {
            if (at === 'cats__daily__during_day_cats_love_to_play_around') {
              return new Promise<never>(() => {});
            }

            return driver.actOnServerSide(at, payload);
          },
          getExpectedScreenshots: async (at, payload) =>
            fromActionsToScreenshots(at, payload, 'expected'),
          getExpectedRecords: async () => [],
          areScreenshotsEqual: async () => true,
        }))
        .build(),
      act: (actor) =>
        actor
          .do(openGroup('Cats'))
          .do(openGroup('Daily'))
          .do(runStoryOrGroup('Cats')),
    }),
  ]),
]);
