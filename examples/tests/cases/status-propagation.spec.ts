import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import {
  acceptStoryOrGroup,
  openStoryOrGroup,
  runStoryOrGroup,
  screenshot,
} from './actors';

test('acting error is propagated over fresh results', {
  preview: preview().stories(({ describe, it, finder }) => [
    describe('Cats', [
      it('in general are small', {
        render: () => null,
      }),
      it('during day cats love to play around', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'Pet' })),
        render: () => null,
      }),
    ]),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'Cats');
    await openStoryOrGroup(page, 'Cats');
    await screenshot(page);
  },
});

test('test error is propagated over fresh results', {
  preview: preview().stories(({ describe, it }) => [
    describe('Cats', [
      it('in general are small', {
        render: () => null,
      }),
      it('during day cats love to play around', {
        render: () => Date.now(),
      }),
    ]),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'Cats');
    await acceptStoryOrGroup(page, 'Cats');

    await page.reload();

    await runStoryOrGroup(page, 'Cats');
    await openStoryOrGroup(page, 'Cats');
    await screenshot(page);
  },
});

test('fresh is propagated over success results', {
  preview: preview().stories(({ describe, it }) => [
    describe('Cats', [
      it('in general are small', {
        render: () => null,
      }),
      it('during day cats love to play around', {
        render: () => null,
      }),
    ]),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'Cats');
    await openStoryOrGroup(page, 'Cats');
    await acceptStoryOrGroup(page, 'in general are small');
    await screenshot(page);
  },
});

// TODO: 'fresh is shown even when not all are done'
// TODO: 'failure is shown even when not all are done'
// TODO: 'error is shown even when not all are done'
// TODO: 'checkmark is not shown until all running are done'
