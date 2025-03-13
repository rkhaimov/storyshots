import path from 'path';

import type { PreviewServer } from '@storyshots/manager';

export function createWorkerSupplier(
  mswPath = path.join(__dirname, 'mockServiceWorker.js'),
): PreviewServer {
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
