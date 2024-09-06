import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import { withManyPresets } from './factories';
import {
  acceptActiveSnapshot,
  acceptStoryOrGroup,
  openRecords,
  openScreenshot,
  openStoryOrGroup,
  runStoryOrGroup,
  runStoryOrGroupComplete,
  screenshot,
  toggleConfigPane,
} from './actors';

test('allows to configure presets for preview', {
  preview: setup(),
  test: async (page) => {
    await openStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await toggleConfigPane(page);
    await screenshot(page);

    await page.getByText('Russian').click();
    await screenshot(page);

    await page.getByTitle('Chinese').click();
    await screenshot(page);

    await page.getByText('Dark').click();
    await screenshot(page);

    await toggleConfigPane(page);
    await screenshot(page);

    await runStoryOrGroup(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);

    await acceptStoryOrGroup(page, 'pets are great');
    await screenshot(page);
  },
});

test('runs screenshots for all presets permutations', {
  preview: setup(),
  test: async (page) => {
    await runStoryOrGroupComplete(page, 'pets are great');
    await openStoryOrGroup(page, 'FINAL');
    await screenshot(page);

    await page.getByText('Theme-Light__Language-Russian').click();
    await screenshot(page);

    await acceptActiveSnapshot(page);
    await screenshot(page);

    await acceptStoryOrGroup(page, 'pets are great');
    await screenshot(page);
  },
});

test('marks story as accepted when all screenshots are valid', {
  preview: setup(),
  test: async (page) => {
    await runStoryOrGroupComplete(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');

    await page.reload();

    await runStoryOrGroupComplete(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

test('marks story as unaccepted when at least one screenshot is invalid', {
  preview: setup().stories(({ it }) => [
    it('pets are great', {
      render: ({ lang, theme }) =>
        lang === 'chinese' && theme === 'light' ? Date.now() : 'Nothing',
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroupComplete(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');

    await page.reload();

    await runStoryOrGroupComplete(page, 'pets are great');
    await screenshot(page);
  },
});

test('records are not split for each preset', {
  preview: setup(),
  test: async (page) => {
    await runStoryOrGroupComplete(page, 'pets are great');
    await acceptStoryOrGroup(page, 'pets are great');
    await openRecords(page);
    await screenshot(page);
  },
});

function setup() {
  return preview()
    .tap(withManyPresets)
    .stories(({ it, createElement }) => [
      it('pets are great', {
        render: ({ lang, theme }) =>
          createElement(
            'h1',
            {},
            `Current lang is ${lang} and theme is ${theme}`,
          ),
      }),
    ]);
}
