import { createGroup, createStory } from '../../storyshots/client/config';
import { createNeverEndingPromise } from './utils';
import { finder } from '../../../src/client';

export const balanceStories = createGroup('Balance', [
  createStory({
    title: 'Default',
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
  createStory({
    title: 'Increment',
    act: (actor) =>
      actor
        .click(
          finder
            .getByRole('listitem')
            .has(finder.getByText('Balance'))
            .getByRole('button', { name: 'Navigate' }),
        )
        .click(finder.getByRole('button', { name: 'Work hard' })),
  }),
  createStory({
    title: 'Decrement',
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(0))
        .click(finder.getByRole('button', { name: 'Work hard' }))
        .screenshot('Incremented')
        .click(finder.getByRole('button', { name: 'Relax' })),
  }),
  createStory({
    title: 'Initializing',
    arrange: (externals) => ({
      ...externals,
      balance: {
        ...externals.business,
        getBalanceAt: createNeverEndingPromise,
      },
    }),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
  createStory({
    title: 'OtherInitialValue',
    arrange: (externals) => ({
      ...externals,
      balance: {
        ...externals.business,
        getBalanceAt: async () => 100_000,
      },
    }),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
  createStory({
    title: 'PassingCorrectNow',
    arrange: (externals, journal) => ({
      ...externals,
      balance: {
        ...externals.business,
        getBalanceAt: journal.record(
          'getInitialValue',
          externals.business.getBalanceAt,
        ),
      },
    }),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
]);
