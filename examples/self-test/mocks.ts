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

export function createExternalsJournal(externals: IExternals) {
  return externals;
}

function shouldNeverBeCalled(): never {
  throw new Error('Should not be called');
}
