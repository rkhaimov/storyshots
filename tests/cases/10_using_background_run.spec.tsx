/* eslint-disable react/react-in-jsx-scope */
import { expect } from '@playwright/test';
import { Background, background } from '../reusables/background';
import { describe, test } from '../reusables/test';
import {
  concat,
  createEmptyDescription,
  TestDescription,
} from '../reusables/test/description';
import { UI, ui } from '../reusables/ui';
import { desktop } from './reusables/device';

describe('using background run', () => {
  test(
    'allows to run all',
    concat(setup(background), setup(ui).run('is a story').screenshot()),
  );

  test(
    'accepts any changes automatically',
    concat(
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
    concat(
      setup(ui).run('is a story').accept('is a story'),
      setup(background),
      setup(ui).run('is a story').screenshot(),
    ),
  );

  test(
    'throws when error has occurred',
    throwing(
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

function throwing(description: TestDescription): TestDescription {
  return {
    __description: () => ({
      ...description.__description(),
      onRun: async (...args) => {
        const { run } = await description.__description().onRun(...args);

        await expect(run()).rejects.toThrow(Error);

        return createEmptyDescription()
          .__description()
          .onRun(...args);
      },
    }),
  };
}

function setup(on: UI | Background) {
  return desktop(on)
    .story(() => ({
      render: () => <h1>Hello, App!</h1>,
    }))
    .actor();
}
