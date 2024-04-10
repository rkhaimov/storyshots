import { Journal } from '@storyshots/react-preview';
import { IExternals } from '../../packages/manager/src/client/externals/types';

export function createExternalsDefaultMocks(): IExternals {
  return {
    driver: {
      actOnClientSide: async () => ({ type: 'success', data: undefined }),
      createScreenshotPath: shouldNeverBeCalled,
      getExpectedRecords: shouldNeverBeCalled,
      getExpectedScreenshots: shouldNeverBeCalled,
      acceptRecords: shouldNeverBeCalled,
      acceptScreenshot: shouldNeverBeCalled,
      actOnServerSide: shouldNeverBeCalled,
      areScreenshotsEqual: shouldNeverBeCalled,
    },
    preview: {
      Frame: () => null,
      createPreviewConnection: () => new Promise<never>(() => {}),
      usePreviewBuildHash: () => 'hash',
    },
  };
}

export function createExternalsJournal(
  externals: IExternals,
  journal: Journal,
): IExternals {
  return {
    ...externals,
    driver: {
      ...externals.driver,
      actOnServerSide: journal.record(
        'actOnServerSide',
        externals.driver.actOnServerSide,
      ),
    },
  };
}

function shouldNeverBeCalled(): never {
  throw new Error('Should not be called');
}
