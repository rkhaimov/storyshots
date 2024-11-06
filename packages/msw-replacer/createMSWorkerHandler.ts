import path from 'path';

import type { PreviewServe } from '@storyshots/manager';

export function createMSWorkerHandler(): PreviewServe {
  return {
    handler: (req, res, next) => {
      if (req.url.includes('mockServiceWorker.js')) {
        res.sendFile(path.join(__dirname, 'mockServiceWorker.js'));

        return;
      }

      return next();
    },
    onUpdate: () => {},
  };
}
