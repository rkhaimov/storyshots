import path from 'path';
import { RUNNER, runUI } from '../../../../packages/manager/src';
import { createPreviewServe } from './createPreviewServe';

export const config: Parameters<typeof runUI>[0] = {
  devices: [
    {
      type: 'size-only',
      name: 'desktop',
      config: { width: 1480, height: 920 },
    },
    {
      type: 'emulated',
      name: 'mobile',
      config: {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        width: 414,
        height: 896,
        deviceScaleFactor: 3,
      },
    },
  ],
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), '..', '..', 'temp'),
  },
  preview: createPreviewServe(),
  runner: RUNNER.pool({ agentsCount: 4 }),
};
