import { IExternals } from '@storyshots/manager/src/client/externals/types';
import { Journal } from '@storyshots/react-preview';
import { shouldNeverBeCalled } from '../reusables/shouldNeverBeCalled';
import { fromActionsToScreenshots, fromMetaToImage } from './screenshot';

export function createExternalsMock(): IExternals {
  return {
    driver: {
      actOnClientSide: async () => ({ type: 'success', data: undefined }),
      createScreenshotPath: fromMetaToImage,
      acceptRecords: async () => {},
      acceptScreenshot: async () => {},
      actOnServerSide: async (at, payload) => ({
        type: 'success',
        data: {
          records: [],
          screenshots: fromActionsToScreenshots(at, payload, 'actual'),
        },
      }),
      getExpectedRecords: async () => null,
      getExpectedScreenshots: async () => [],
      areScreenshotsEqual: shouldNeverBeCalled,
    },
    preview: {
      Frame: () => null,
      createPreviewConnection: () => new Promise<never>(() => {}),
      usePreviewBuildHash: () => 'hash',
    },
  };
}

export function createJournaledExternals(
  externals: IExternals,
  journal: Journal,
): IExternals {
  return {
    ...externals,
    driver: {
      ...externals.driver,
      acceptRecords: journal.record(
        'acceptRecords',
        externals.driver.acceptRecords,
      ),
      acceptScreenshot: journal.record(
        'acceptScreenshot',
        externals.driver.acceptScreenshot,
      ),
      actOnClientSide: journal.record(
        'actOnClientSide',
        externals.driver.actOnClientSide,
      ),
    },
  };
}
