import { ManagerConfig, mergeServe } from '@storyshots/core/manager';
import { createWorkerSupplier } from '@storyshots/msw-externals/createWorkerSupplier';
import path from 'path';
import { createPreviewServer } from './createPreviewServer';

export async function createConfig(): Promise<ManagerConfig> {
  return {
    devices: [
      {
        name: 'desktop',
        width: 1480,
        height: 920,
      },
      {
        name: 'mobile',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        width: 414,
        height: 896,
      },
    ],
    paths: {
      screenshots: path.join(process.cwd(), 'screenshots'),
      records: path.join(process.cwd(), 'records'),
      temp: path.join(process.cwd(), '..', '..', '..', 'temp'),
    },
    preview: mergeServe(createWorkerSupplier(), await createPreviewServer()),
  };
}
