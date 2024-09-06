import { test } from '../reusables/test';
import {
  acceptStoryOrGroup,
  openScreenshot,
  openStoryOrGroup,
  runAll,
  runStoryOrGroup,
  screenshot,
} from './actors';
import { withLotsOfStories } from './factories';
import { preview } from '../reusables/preview';

test('allows to run all stories in a group', {
  preview: setup(),
  test: async (page) => {
    await runStoryOrGroup(page, 'Cats');
    await screenshot(page);

    await openStoryOrGroup(page, 'Cats');
    await openStoryOrGroup(page, 'Daily');
    await openStoryOrGroup(page, 'Nightly');
    await screenshot(page);

    await acceptStoryOrGroup(page, 'Cats');
    await screenshot(page);

    await openScreenshot(page, 'FINAL', 0);
    await screenshot(page);

    await openScreenshot(page, 'FINAL', 1);
    await screenshot(page);
  },
});

test('allows to run all stories', {
  preview: setup(),
  test: async (page) => {
    await runAll(page);
    await screenshot(page);

    await openStoryOrGroup(page, 'Cats');
    await openScreenshot(page, 'FINAL', 0);
    await screenshot(page);

    await openStoryOrGroup(page, 'Dogs');
    await openScreenshot(page, 'FINAL', 1);
    await screenshot(page);
  },
});

function setup() {
  return preview().tap(withLotsOfStories);
}
