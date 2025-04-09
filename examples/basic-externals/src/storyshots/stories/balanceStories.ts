import { finder } from '@storyshots/core';
import { describe, it } from '../preview/config';
import { open } from './utils/actors';
import { record, set } from './utils/arrangers';

export const balanceStories = describe('Balance', [
  it('shows current salary', {
    act: open('Balance'),
  }),
  it('provides ability to work hard', {
    act: (actor) =>
      actor
        .do(open('Balance'))
        .click(finder.getByRole('button', { name: 'Work hard' })),
  }),
  it('lets user to relax and spend money', {
    act: (actor) =>
      actor
        .do(open('Balance'))
        .click(finder.getByRole('button', { name: 'Work hard' }))
        .screenshot('Incremented')
        .click(finder.getByRole('button', { name: 'Relax' })),
  }),
  it('shows spinner when balance is not retrieved yet', {
    arrange: set('business.getBalanceAt', () => new Promise<never>(() => {})),
    act: open('Balance'),
  }),
  it('balance can be different by default', {
    arrange: set('business.getBalanceAt', async () => 100_000),
    act: open('Balance'),
  }),
  it('provides correct date when retrieving current balance', {
    arrange: record('business.getBalanceAt'),
    act: open('Balance'),
  }),
]);
