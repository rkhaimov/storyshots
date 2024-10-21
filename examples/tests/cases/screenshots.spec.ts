import { test } from '../reusables/test';
import { openScreenshot, runStoryOrGroup, screenshot } from './actors';
import { preview } from '../reusables/preview';
import { withStatefulExternals } from '../reusables/state';

test('captures all user defined screenshots', {
  preview: preview().stories(({ it, createElement }) => [
    it('pets are great', {
      render: () => createElement('p', {}, 'Some facts proving this statement'),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');
    await screenshot(page);

    await page.getByRole('button').getByText('Accept').click();
    await screenshot(page);

    await page.reload();

    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);
  },
});

test('shows the difference with baseline', {
  preview: preview()
    .tap(withStatefulExternals)
    .stories(({ it, useState, useEffect, useMemo, finder, createElement }) => [
      it('pets are great', {
        act: (actor) =>
          actor
            .screenshot('Initial')
            .click(finder.getByText('Act'))
            .wait(1_000)
            .screenshot('Incremented'),
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
    ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await openScreenshot(page, 'Initial');
    await screenshot(page);

    await page.getByRole('button').getByText('Accept').click();
    await screenshot(page);

    await openScreenshot(page, 'Incremented');
    await screenshot(page);

    await page.getByRole('button').getByText('Accept').click();
    await screenshot(page);

    await page.reload();

    await runStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await openScreenshot(page, 'Initial');
    await screenshot(page);

    await openScreenshot(page, 'Swipe');
    await screenshot(page);
  },
});
