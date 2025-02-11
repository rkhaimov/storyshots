import { Action, describe, test } from '../reusables/test';
import { devices } from './reusables/device';

describe('devices preview run', () => {
  test(
    'uses first defined device by default for preview',
    setup().open('is a story').screenshot(),
  );

  test(
    'uses first defined device by default for run',
    setup().run('is a story').open('FINAL').screenshot(),
  );

  test(
    'allows set default device for run',
    setup()
      .do(selectMobileDevice())
      .run('is a story')
      .open('FINAL')
      .screenshot(),
  );

  test(
    'allows set default device for preview',
    setup()
      .do(selectMobileDevice())
      .do((page) => page.getByText('Apply to preview').click())
      .open('is a story')
      .screenshot(),
  );

  test(
    'does not set default device for preview when not emulating',
    setup().do(selectMobileDevice()).open('is a story').screenshot(),
  );
});

function setup() {
  return devices()
    .story(() => ({ render: (_, { device }) => device.name }))
    .actor();
}

function selectMobileDevice(): Action {
  return async (page) => {
    await page.getByLabel('Toggle config pane').click();

    await page.getByText('desktop').click();

    await page.getByTitle('mobile').click();
  };
}
