import path from 'path';

import type { PreviewServe } from '@storyshots/manager';

export function createWorkerSupplier(
  mswPath = path.join(__dirname, 'mockServiceWorker.js'),
): PreviewServe {
  return {
    handler: (req, res, next) => {
      if (req.url.includes('mockServiceWorker.js')) {
        res.sendFile(mswPath);

        return;
      }

      return next();
    },
    onUpdate: () => {},
  };
}
