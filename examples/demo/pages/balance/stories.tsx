import { finder } from '@storyshots/core';
import { describe, it } from '../../storyshots/preview/config';

export const balanceStories = describe('Balance', [
  it('shows current salary', {
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
  it('provides ability to work hard', {
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
  it('lets user to relax and spend money', {
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(0))
        .click(finder.getByRole('button', { name: 'Work hard' }))
        .screenshot('Incremented')
        .click(finder.getByRole('button', { name: 'Relax' })),
  }),
  it('shows spinner when balance is not retrieved yet', {
    arrange: (externals) => ({
      ...externals,
      business: {
        ...externals.business,
        getBalanceAt: () => new Promise<never>(() => {}),
      },
    }),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
  it('balance can be different by default', {
    arrange: (externals) => ({
      ...externals,
      business: {
        ...externals.business,
        getBalanceAt: async () => 100_000,
      },
    }),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
  it('provides correct date when retrieving current balance', {
    arrange: (externals, { journal }) => ({
      ...externals,
      business: {
        ...externals.business,
        getBalanceAt: journal.asRecordable(
          'getInitialValue',
          externals.business.getBalanceAt,
        ),
      },
    }),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(0)),
  }),
]);
