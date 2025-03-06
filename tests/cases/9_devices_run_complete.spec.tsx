/* eslint-disable react/react-in-jsx-scope */
import { Action } from '../reusables/factories';
import { describe, test } from '../reusables/test';
import { devices } from './reusables/device';

describe('devices run complete', () => {
  test(
    'allows to run a story across all devices',
    setup()
      .screenshot()
      .open('Records', 'desktop')
      .screenshot()
      .open('FINAL', 'desktop')
      .screenshot()
      .open('FINAL', 'mobile')
      .screenshot()
      .open('Records', 'mobile')
      .screenshot(),
  );

  test(
    'compares shots between devices independently',
    setup()
      .accept('is a story')
      .preview()
      .story(() => ({
        render: (_, { device, journal }) => {
          journal.record(device.name);

          return device.name === 'desktop' ? device.name : 'broken on mobile';
        },
      }))
      .actor()
      .do(runComplete())
      .screenshot()
      .open('FINAL', 'mobile')
      .screenshot(),
  );

  test(
    'compares records between devices independently',
    setup()
      .accept('is a story')
      .preview()
      .story(() => ({
        render: (_, { device, journal }) => {
          journal.record(
            device.name === 'desktop' ? device.name : 'broken on mobile',
          );

          return device.name;
        },
      }))
      .actor()
      .do(runComplete())
      .screenshot()
      .open('Records', 'mobile')
      .screenshot(),
  );

  test(
    'displays errors independently',
    devices()
      .story(({ finder }) => ({
        act: (actor, { device }) =>
          device.name === 'desktop'
            ? actor
            : actor.click(finder.getByText('Submit')),
        render: () => (
          <div>
            <button>Submit</button>
            <button>Submit</button>
          </div>
        ),
      }))
      .actor()
      .do(runComplete())
      .screenshot()
      .do((page) => page.getByLabel('Progress').click())
      .screenshot(),
  );
});

function setup() {
  return devices()
    .story(() => ({
      render: (_, { device, journal }) => {
        journal.record(device.name);

        return device.name;
      },
    }))
    .actor()
    .do(runComplete());
}

function runComplete(): Action {
  return async (page) => {
    await page.getByText('is a story').hover();

    await page
      .getByLabel('is a story')
      .getByLabel('Run complete', { exact: true })
      .click();

    await page
      .getByLabel('Status')
      .getByRole('button', { name: 'Run complete' })
      .waitFor({ state: 'visible' });
  };
}
