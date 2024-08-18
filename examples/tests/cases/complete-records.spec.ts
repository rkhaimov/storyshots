import { test } from '../reusables/test';
import { acceptStoryOrGroup, openRecords, runStoryOrGroupComplete, screenshot } from './actors';
import { withCommandSample, withMobileDevice } from './factories';
import { preview } from '../reusables/preview';
import { withStatefulExternals } from '../reusables/state';

test('records calls unique to a given device', {
  preview: preview()
    .tap(withMobileDevice)
    .tap(withCommandSample)
    .stories(({ it, finder, createElement }) => [
      it('pets are great', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'Pet' })),
        render: ({ isMobile, pet }) =>
          createElement(
            'button',
            { onClick: () => isMobile() && pet('Tom') },
            'Pet',
          ),
      }),
    ]),
  test: async (page) => {
    await runStoryOrGroupComplete(page, 'pets are great');
    await screenshot(page);

    await openRecords(page, 0);
    await screenshot(page);

    await openRecords(page, 1);
    await screenshot(page);

    await acceptStoryOrGroup(page, 'pets are great');
    await screenshot(page);
  },
});

test('compares records between', {
  preview: preview()
    .tap(withMobileDevice)
    .tap(withStatefulExternals)
    .stories(({ it, finder, createElement }) => [
      it('pets are great', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'Pet' })),
        render: ({ isMobile, update, get }) =>
          createElement(
            'button',
            { onClick: async () => isMobile() && update(await get()) },
            'Pet',
          ),
      }),
    ]),
  test: async (page) => {
    await runStoryOrGroupComplete(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');

    await page.reload();

    await runStoryOrGroupComplete(page, 'pets are great');
    await openRecords(page, 1);
    await screenshot(page);
  },
});
