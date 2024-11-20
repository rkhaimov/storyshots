import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import { openStoryOrGroup } from './actors';

test('replays story when it is clicked repeatedly', {
  preview: preview().stories(({ it, createElement }) => [
    it('pets are great', {
      render: () => createElement('h1', {}, 'It is a fact'),
    }),
  ]),
  test: async (page) => {
    await openStoryOrGroup(page, 'pets are great');

    await openStoryOrGroup(page, 'pets are great');
  },
});
