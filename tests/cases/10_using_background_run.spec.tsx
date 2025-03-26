/* eslint-disable react/react-in-jsx-scope */
import { Background, background } from '../reusables/background';
import { describe, test } from '../reusables/test';
import {
  concatDescriptions,
  withManagerThrowing,
} from '../reusables/test/test-description';
import { UI, ui } from '../reusables/ui';
import { desktop } from './reusables/device';

describe('using background run', () => {
  test(
    'allows to run all',
    concatDescriptions(
      setup(background),
      setup(ui).run('is a story').screenshot(),
    ),
  );

  test(
    'accepts any changes automatically',
    concatDescriptions(
      setup(background),
      desktop(background)
        .story(() => ({
          render: () => <h1>Changed</h1>,
        }))
        .actor(),
      setup(ui).run('is a story').open('FINAL').screenshot(),
    ),
  );

  test(
    'does not do anything when there is no diff',
    concatDescriptions(
      setup(ui).run('is a story').accept('is a story'),
      setup(background),
      setup(ui).run('is a story').screenshot(),
    ),
  );

  test(
    'throws when error has occurred',
    withManagerThrowing(
      desktop(background)
        .story(({ finder }) => ({
          act: (actor) => actor.click(finder.getByText('Submit')),
          render: () => (
            <div>
              <button>Submit</button>
              <button>Submit</button>
            </div>
          ),
        }))
        .actor(),
    ),
  );
});

function setup(on: UI | Background) {
  return desktop(on)
    .story(() => ({
      render: () => <h1>Hello, App!</h1>,
    }))
    .actor();
}
