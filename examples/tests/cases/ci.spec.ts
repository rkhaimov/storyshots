import { runTestsCI } from '../../../packages/manager/src/server/modes/runTestsCI';
import { expect, test } from '@playwright/test';
import { createConfigAndCleanup } from '../reusables/createConfigAndCleanup';
import { preview } from '../reusables/preview';
import { withLotsOfStories } from './factories';
import { runHeadless } from '../../../packages/manager/src/server/modes/runHeadless';
import { runAll, screenshot } from './actors';

test('runs all stories and adds them all', async ({ page }) => {
  test.setTimeout(120_000);

  const config = createConfigAndCleanup(preview().tap(withLotsOfStories));

  const ci = await runTestsCI(config);

  ci.cleanup();

  const headless = await runHeadless(config);

  await page.goto('http://localhost:6006/?manager=SECRET');

  await runAll(page);
  await screenshot(page);

  headless.cleanup();
});

test('throws when story are failed to execute', async () => {
  const config = createConfigAndCleanup(
    preview().stories(({ it, finder }) => [
      it('pets are great', {
        act: (actor) =>
          actor.click(finder.getByRole('button', { name: 'pet' })),
        render: () => null,
      }),
    ]),
  );

  await expect(runTestsCI(config)).rejects.toThrow();
});

// TODO: 'automatically updates failed stories'
