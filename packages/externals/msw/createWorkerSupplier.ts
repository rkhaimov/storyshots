import type { IPreviewServer } from '@storyshots/core/manager';

export function createWorkerSupplier(): IPreviewServer {
  return {
    handler: (req, res, next) => {
      if (req.url.includes('mockServiceWorker.js')) {
        res.sendFile(require.resolve('msw/mockServiceWorker.js'));

        return;
      }

      return next();
    },
    cleanup: async () => {},
    onUpdate: () => {},
  };
}
