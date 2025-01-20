import devtools from '@storyshots/react-preview/devtools';
import path from 'path';
import { runUI, RUNNER } from '../../../../packages/manager/src';
import { createPreviewServe } from './createPreviewServe';

export const config: Parameters<typeof runUI>[0] = {
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), '..', '..', 'temp'),
  },
  preview: createPreviewServe(),
  runner: RUNNER.cluster({ agentsCount: 4 }),
  devtools,
};
