import {
    acceptActiveRecordOrScreenshot,
    openGroup,
    openRecords, runCompleteStoryOrGroup,
} from '../../reusables/actor-transformers';
import { arranger } from '../../arranger';
import { createStoriesStub } from '../../arranger/createStoriesStub';
import { describe, it } from '../../storyshots/preview/config';

export const runCompleteRecordsStories = describe('Records', [
  it('records calls unique to a given device', {
    arrange: setup().build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .screenshot('Ran')
        .do(openRecords())
        .screenshot('Desktop')
        .do(acceptActiveRecordOrScreenshot())
        .do(openRecords(1))
        .screenshot('Mobile')
        .do(acceptActiveRecordOrScreenshot()),
  }),
  it('compares records between', {
    arrange: setup()
      .driver((driver) => ({
        ...driver,
        getExpectedRecords: async (_, device) =>
          device.name === 'mobile'
            ? [
                {
                  method: 'getMobileSpecificData',
                  args: [],
                },
              ]
            : [],
      }))
      .build(),
    act: (actor) =>
      actor
        .do(openGroup('Cats'))
        .do(runCompleteStoryOrGroup('in general are small'))
        .screenshot('Ran')
        .do(openRecords())
        .screenshot('Desktop')
        .do(acceptActiveRecordOrScreenshot())
        .do(openRecords(1))
        .screenshot('Mobile'),
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
    .driver((driver) => ({
      ...driver,
      actOnServerSide: async (at, payload) => {
        const result = await driver.actOnServerSide(at, payload);

        if (result.type === 'error') {
          return result;
        }

        const method =
          payload.config.device.name === 'mobile'
            ? 'getMobileSpecificData'
            : 'getDesktopSpecificData';

        return {
          type: 'success',
          data: {
            ...result.data,
            records: [
              {
                method,
                args: [],
              },
            ],
          },
        };
      },
    }))
    .stories(createStoriesStub);
}

// TODO: Test device arrange