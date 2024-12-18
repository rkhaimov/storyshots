import { test } from '@playwright/test';
import { runHeadless } from '@storyshots/manager/src/server/modes/runHeadless';
import { createConfigAndCleanup } from '../reusables/createConfigAndCleanup';
import { preview } from '../reusables/preview';
import {
  withStatefulExternals,
  withStatefulHandlers,
} from '../reusables/state';
import { acceptStoryOrGroup, openRecords, runAll, screenshot } from './actors';

test('retries specified amount of times when failed', async ({ page }) => {
  test.setTimeout(120_000);

  const config = createConfigAndCleanup(
    preview()
      .tap(withStatefulExternals)
      .stories(({ it, finder, createElement }) => [
        it('pets are great', {
          act: (actor) =>
            actor.click(finder.getByRole('button', { name: 'pet' })),
          render: ({ get, update }) =>
            createElement(
              'button',
              {
                onClick: async () => update(await get()),
              },
              ['pet'],
            ),
        }),
      ]),
    3,
  );

  const first = await runHeadless(config);

  withStatefulHandlers(first.app, 1);

  await page.goto('http://localhost:6006/?manager=SECRET');

  await runAll(page);
  await openRecords(page);
  await acceptStoryOrGroup(page, 'pets are great');
  await screenshot(page);

  first.cleanup();

  const second = await runHeadless(config);

  withStatefulHandlers(second.app, 0);

  await page.goto('http://localhost:6006/?manager=SECRET');

  await runAll(page);
  await openRecords(page);
  await screenshot(page);

  second.cleanup();
});
