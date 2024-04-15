import { arranger } from '../../arranger';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { fromActionsToScreenshots, Meta } from '../../mocks/screenshot';
import {
    acceptActiveRecordOrScreenshot,
    openGroup,
    openScreenshot, runCompleteStoryOrGroup,
} from '../../reusables/actor-transformers';
import { describe, it } from '../../storyshots/preview/config';

export const runCompleteScreenshotsStories = describe('Screenshots', [
  it('captures all user defined screenshots unique to device', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('DesktopScreenshot'))
        .screenshot('Desktop')
        .do(acceptActiveRecordOrScreenshot())
        .do(openScreenshot('FINAL'))
        .screenshot('DesktopFinal')
        .do(acceptActiveRecordOrScreenshot())
        .do(openScreenshot('MobileScreenshot'))
        .screenshot('Mobile')
        .do(acceptActiveRecordOrScreenshot())
        .do(openScreenshot('FINAL', 1))
        .screenshot('MobileFinal')
        .do(acceptActiveRecordOrScreenshot()),
  }),
  it('compares all user defined screenshots from different devices', {
    arrange: setup()
      .driver((driver) => ({
        ...driver,
        areScreenshotsEqual: async (screenshots) => {
          const { config }: Meta = JSON.parse(screenshots.right);

          return config.device.name === 'mobile';
        },
        getExpectedScreenshots: async (at, payload) =>
          fromActionsToScreenshots(at, payload, 'expected'),
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .screenshot('Ran')
        .do(openScreenshot('DesktopScreenshot'))
        .screenshot('Comparison')
        .do(acceptActiveRecordOrScreenshot())
        .do(openScreenshot('FINAL'))
        .do(acceptActiveRecordOrScreenshot()),
  }),
]);

function setup() {
  return arranger()
    .config((config) => ({
      ...config,
      devices: [
        {
          type: 'emulated',
          name: 'desktop',
          config: { width: 1480, height: 920 },
        },
        {
          type: 'emulated',
          name: 'mobile',
          config: { userAgent: 'iphone', width: 560, height: 300 },
        },
      ],
    }))
    .stories((f) =>
      createStoriesStub(f, () =>
        f.it('in general are small', {
          act: (actor, device) =>
            device.name === 'mobile'
              ? actor.screenshot('MobileScreenshot')
              : actor.screenshot('DesktopScreenshot'),
          render: () => null,
        }),
      ),
    );
}

// TODO: Add test for multi preset screenshots and records
