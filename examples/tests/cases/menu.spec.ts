import { test } from '../reusables/test';
import { openStoryOrGroup, screenshot } from './actors';
import { preview } from '../reusables/preview';
import { withLotsOfStories } from './factories';

test('shows preloader skeleton when preview is loading', {
  preview: preview().entry(() => {}),
  test: (page) => screenshot(page),
});

test('shows select story by default for no stories', {
  preview: preview(),
  test: (page) => screenshot(page),
});

test('show select story by default when there are stories', {
  preview: preview().tap(withLotsOfStories),
  test: async (page) => {
    await screenshot(page);

    await openStoryOrGroup(page, 'Dogs');
    await screenshot(page);

    await openStoryOrGroup(page, 'Cats');
    await screenshot(page);

    await openStoryOrGroup(page, 'Daily');
    await screenshot(page);

    await openStoryOrGroup(page, 'Nightly');
    await screenshot(page);

    await openStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await openStoryOrGroup(page, 'in general are small');
    await screenshot(page);
  },
});
