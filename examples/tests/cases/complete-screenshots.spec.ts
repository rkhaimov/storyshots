import { test } from '../reusables/test';
import {
  acceptStoryOrGroup,
  openScreenshot,
  runStoryOrGroupComplete,
  screenshot,
} from './actors';
import { preview } from '../reusables/preview';
import { withMobileDevice } from './factories';
import { withStatefulExternals } from '../reusables/state';

test('captures all user defined screenshots unique to device', {
  preview: preview()
    .tap(withMobileDevice)
    .tap(withStatefulExternals)
    .stories(({ it, useState, useEffect, createElement, finder, useMemo }) => [
      it('pets are great', {
        act: (actor, { device }) => {
          if (device.name === 'desktop') {
            return actor
              .click(finder.getByText('Hide'))
              .screenshot('DesktopFinal');
          }

          return actor.click(finder.getByText('Act')).screenshot('MobileFinal');
        },
        render: (externals) => {
          const Component = useMemo(
            () => () => {
              const [data, setData] = useState<number>();
              const [hide, setHide] = useState(false);

              useEffect(() => {
                externals.get().then(({ data }) => setData(data));
              }, []);

              if (data === undefined) {
                return createElement('p', {}, 'Loading');
              }

              if (hide) {
                return createElement('div', {}, 'Hidden');
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
                createElement(
                  'button',
                  {
                    onClick: () => setHide(true),
                  },
                  'Hide',
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
    await runStoryOrGroupComplete(page, 'pets are great');
    await screenshot(page);

    await acceptStoryOrGroup(page, 'pets are great');
    await screenshot(page);

    await runStoryOrGroupComplete(page, 'pets are great');
    await screenshot(page);

    await openScreenshot(page, 'MobileFinal');
    await screenshot(page);
  },
});
