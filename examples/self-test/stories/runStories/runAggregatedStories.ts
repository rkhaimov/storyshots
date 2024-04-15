import { finder } from '@storyshots/react-preview';
import { arranger } from '../../arranger';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { describe, it } from '../../storyshots/preview/config';
import {
  openGroup,
  openRecords,
  openScreenshot,
  runStoryOrGroup,
} from '../../reusables/actor-transformers';

export const runAggregatedStories = describe('Aggregated', [
  it('allows to run all stories in a group', {
    arrange: arranger().stories(createStoriesStub).build(),
    act: (actor) =>
      actor
        .do(runStoryOrGroup('Cats'))
        .screenshot('Ran')
        .do(openGroup('Cats'))
        .do(openScreenshot('FINAL'))
        .screenshot('CatsFinal')
        .do(openRecords())
        .screenshot('CatsRecords')
        .do(openGroup('Daily'))
        .do(openScreenshot('FINAL', 1))
        .screenshot('DailyFinal')
        .do(openRecords(1))
        .hover(finder.getByText('Cats'))
        .click(finder.getByRole('button', { name: 'Accept all' })),
  }),
  it('allows to run all stories', {
    arrange: arranger().stories(createStoriesStub).build(),
    act: (actor) => actor.click(finder.getByRole('button', { name: 'Run' })),
  }),
  it('shows waiting', {
    arrange: arranger()
      .stories(createStoriesStub)
      .driver((driver) => ({
        ...driver,
        actOnServerSide: () => new Promise(() => {}),
      }))
      .build(),
    act: (actor) => actor.click(finder.getByRole('button', { name: 'Run' })),
  }),
  it('shows errors', {
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
        .do(openGroup('Cats'))
        .do(openGroup('Daily'))
        .do(openGroup('Nightly'))
        .do(openGroup('Dogs')),
  }),
]);

// TODO: Test case for error message