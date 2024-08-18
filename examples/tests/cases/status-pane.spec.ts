import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import {
  acceptStoryOrGroup,
  runAll,
  runStoryOrGroup,
  screenshot,
} from './actors';

test('allows to examine error descriptions', {
  preview: preview().stories(({ it, finder }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByRole('button', { name: 'Pet' })),
      render: () => 'Nothing',
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await page.getByLabel('Progress').click();
    await screenshot(page);

    await page.getByRole('listitem', { name: 'pets are great' }).click();
    await screenshot(page);
  },
});

test('allows to see all failed stories', {
  preview: preview().stories(({ it, describe }) => [
    it('pets are great', {
      render: () => Date.now(),
    }),
    describe('Cats', [
      it('in general are small', {
        render: (_, { screenshotting }) =>
          screenshotting ? Date.now() : 'Nothing',
      }),
    ]),
  ]),
  test: async (page) => {
    await runAll(page);
    await acceptStoryOrGroup(page, 'pets are great');
    await acceptStoryOrGroup(page, 'Cats');

    await page.reload();

    await runAll(page);
    await page.getByLabel('Progress').click();
    await page.getByText('Failures').click();
    await screenshot(page);

    await page.getByText('in general are small').click();
    await screenshot(page);
  },
});
