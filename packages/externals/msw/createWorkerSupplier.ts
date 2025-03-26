import path from 'path';

import type { IPreviewServer } from '@storyshots/core/manager';

export function createWorkerSupplier(
  mswPath = path.join(__dirname, 'mockServiceWorker.js'),
): IPreviewServer {
  return {
    handler: (req, res, next) => {
      if (req.url.includes('mockServiceWorker.js')) {
        res.sendFile(mswPath);

        return;
      }

      return next();
    },
    cleanup: async () => {},
    onUpdate: () => {},
  };
}
