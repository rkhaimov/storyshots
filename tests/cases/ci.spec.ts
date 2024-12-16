import { expect, test } from '@playwright/test';
import { runHeadless } from '@storyshots/manager/src/server/modes/runHeadless';
import { runTestsCI } from '@storyshots/manager/src/server/modes/runTestsCI';
import { createConfigAndCleanup } from '../reusables/createConfigAndCleanup';
import { preview } from '../reusables/preview';
import {
  withStatefulExternals,
  withStatefulHandlers,
} from '../reusables/state';
import {
  acceptStoryOrGroup,
  openRecords,
  openScreenshot,
  runAll,
  runStoryOrGroup,
  screenshot,
} from './actors';
import { withLotsOfStories } from './factories';

test('runs all stories and adds them all', async ({ page }) => {
  test.setTimeout(120_000);

  const config = createConfigAndCleanup(preview().tap(withLotsOfStories));

  const ci = await runTestsCI(config);

  await ci.run();

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

  await expect(runTestsCI(config).then(({ run }) => run())).rejects.toThrow();
});

test('updates failed shots', async ({ page }) => {
  const config = createConfigAndCleanup(
    preview()
      .tap(withStatefulExternals)
      .stories(
        ({ it, useMemo, finder, useState, useEffect, createElement }) => [
          it('pets are great', {
            act: (actor) =>
              actor
                .screenshot('Initial')
                .click(finder.getByText('Act'))
                .wait(1_000),
            render: (externals) => {
              const Component = useMemo(
                () => () => {
                  const [data, setData] = useState<number>();

                  useEffect(() => {
                    externals.get().then(({ data }) => setData(data));
                  }, []);

                  if (data === undefined) {
                    return createElement('p', {}, 'Loading');
                  }

                  return createElement(
                    'div',
                    {},
                    createElement('p', {}, data),
                    createElement(
                      'button',
                      {
                        onClick: () =>
                          externals
                            .update({ data })
                            .then(() => externals.get())
                            .then(({ data }) => setData(data)),
                      },
                      'Act',
                    ),
                  );
                },
                [],
              );

              return createElement(Component);
            },
          }),
        ],
      ),
  );

  const first = await runHeadless(config);

  withStatefulHandlers(first.app);

  await page.goto('http://localhost:6006/?manager=SECRET');

  await runStoryOrGroup(page, 'pets are great');
  await acceptStoryOrGroup(page, 'pets are great');
  await screenshot(page);

  first.cleanup();

  const second = await runTestsCI(config);

  withStatefulHandlers(second.app, 1);

  await second.run();

  second.cleanup();

  const third = await runHeadless(config);

  withStatefulHandlers(third.app, 2);

  await runStoryOrGroup(page, 'pets are great');
  await openRecords(page);
  await screenshot(page);

  await openScreenshot(page, 'FINAL');
  await screenshot(page);

  third.cleanup();
});
