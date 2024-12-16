import { test } from '../reusables/test';
import {
  openScreenshot,
  openStoryOrGroup,
  runStoryOrGroup,
  screenshot,
  toggleConfigPane,
} from './actors';
import { preview } from '../reusables/preview';
import { withMobileDevice } from './factories';

test('allows to select preview device mode', {
  preview: setup(),
  test: async (page) => {
    await openStoryOrGroup(page, 'pets are great');
    await toggleConfigPane(page);
    await screenshot(page);

    await page.getByText('desktop').click();
    await screenshot(page);

    await page.getByTitle('mobile').click();
    await screenshot(page);

    await page.getByLabel('Apply to preview').click();
    await screenshot(page);
  },
});

test('runs by default only selected device', {
  preview: setup(),
  test: async (page) => {
    await toggleConfigPane(page);
    await page.getByText('desktop').click();
    await page.getByTitle('mobile').click();

    await runStoryOrGroup(page, 'pets are great');
    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

function setup() {
  return preview()
    .tap(withMobileDevice)
    .stories(({ it, createElement }) => [
      it('pets are great', {
        render: ({ isMobile }) =>
          createElement(
            'p',
            {},
            isMobile()
              ? 'Image showing that pets are great on mobile'
              : 'Image showing that pets are great on desktop',
          ),
      }),
    ]);
}
