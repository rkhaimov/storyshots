import { describe, test } from '../reusables/test';
import { desktop } from './reusables/device';

describe('using tree', () => {
  test(
    'allows to group tests with describe',
    desktop()
      .stories(({ describe, it }) => [
        describe('Group', [
          it('is first', { render: () => 'is first' }),
          it('is second', { render: () => 'is second' }),
        ]),
      ])
      .actor()
      .screenshot()
      .open('Group')
      .open('is second')
      .screenshot(),
  );

  test(
    'allows to use more than one describe',
    desktop()
      .stories(({ describe, it }) => [
        describe('First group', [it('is first', { render: () => 'is first' })]),
        describe('Second group', [
          it('is second', { render: () => 'is second' }),
        ]),
      ])
      .actor()
      .screenshot()
      .open('First group')
      .screenshot()
      .open('Second group')
      .screenshot()
      .open('is second')
      .screenshot(),
  );

  test(
    'allows to nest describe',
    desktop()
      .stories(({ describe, it }) => [
        describe('Group', [
          describe('SubGroup', [
            it('is second', { render: () => 'is second' }),
          ]),
          it('is first', { render: () => 'is first' }),
        ]),
      ])
      .actor()
      .screenshot()
      .open('Group')
      .screenshot()
      .open('SubGroup')
      .screenshot()
      .open('is second')
      .screenshot(),
  );

  test(
    'allows to use story factories',
    desktop()
      .stories(({ it, each }) => [
        each(['first', 'second', 'third'], (place) =>
          it(`is ${place}`, { render: () => `is ${place}` }),
        ),
      ])
      .actor()
      .open('is first')
      .screenshot(),
  );

  test(
    'also allows to nest describe',
    desktop()
      .stories(({ it, each, describe }) => [
        each(['first', 'second', 'third'], (place) =>
          describe(place, [it(`is ${place}`, { render: () => `is ${place}` })]),
        ),
      ])
      .actor()
      .open('First')
      .open('is first')
      .screenshot(),
  );
});
