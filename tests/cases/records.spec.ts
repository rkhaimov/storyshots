import { test } from '../reusables/test';
import {
  acceptActiveSnapshot,
  openRecords,
  runStoryOrGroup,
  screenshot,
} from './actors';
import { preview } from '../reusables/preview';
import { withCommandSample } from './factories';
import { withStatefulExternals } from '../reusables/state';

test('records marked methods calls even when empty', {
  preview: preview().stories(({ it, createElement }) => [
    it('pets are great', {
      render: () => createElement('p', {}, 'Some facts proving this statement'),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await openRecords(page);
    await screenshot(page);

    await acceptActiveSnapshot(page);
    await screenshot(page);
  },
});

test('records non empty method calls', {
  preview: preview()
    .tap(withCommandSample)
    .stories(({ it, finder, createElement }) => [
      it('pets are great', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'Pet' })),
        render: ({ pet }) =>
          createElement(
            'button',
            {
              onClick: () => pet('Tom'),
            },
            'Pet',
          ),
      }),
    ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openRecords(page);
    await screenshot(page);

    await acceptActiveSnapshot(page);
    await screenshot(page);
  },
});

test('compares records between and when they are equal', {
  preview: preview()
    .tap(withCommandSample)
    .stories(({ it, finder, createElement }) => [
      it('pets are great', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'Pet' })),
        render: ({ pet }) =>
          createElement(
            'button',
            {
              onClick: () => pet('Tom'),
            },
            'Pet',
          ),
      }),
    ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openRecords(page);
    await acceptActiveSnapshot(page);

    await page.reload();

    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);
  },
});

test('shows difference between records when there is one', {
  preview: preview()
    .tap(withStatefulExternals)
    .stories(({ it, finder, createElement }) => [
      it('pets are great', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'Pet' })),
        render: ({ get, update }) =>
          createElement(
            'button',
            {
              onClick: async () => update(await get()),
            },
            'Pet',
          ),
      }),
    ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await openRecords(page);
    await acceptActiveSnapshot(page);

    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await acceptActiveSnapshot(page);
    await screenshot(page);
  },
});

// TODO: add test case for server side error and client rerun
