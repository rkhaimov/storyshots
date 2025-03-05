import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';

describe('run aggregated', () => {
  test(
    'allows to run whole group at once',
    setup()
      .run('Group')
      .screenshot()
      .open('Group')
      .open('SubGroup')
      .open('Records', 'is second')
      .screenshot()
      .open('FINAL', 'is second')
      .screenshot()
      .open('Records', 'is second')
      .screenshot()
      .open('FINAL', 'is first')
      .screenshot(),
  );

  test(
    'allows to accept all at once',
    setup()
      .run('Group')
      .accept('Group')
      .screenshot()
      .open('Group')
      .open('SubGroup')
      .screenshot(),
  );
});

function setup() {
  return desktop()
    .stories(({ describe, it }) => [
      describe('Group', [
        describe('SubGroup', [
          it('is second', {
            render: (_, { journal }) => {
              journal.record('is second');

              return 'is second';
            },
          }),
        ]),
        it('is first', {
          render: (_, { journal }) => {
            journal.record('is first');

            return 'is first';
          },
        }),
      ]),
    ])
    .actor();
}
