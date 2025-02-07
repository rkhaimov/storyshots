import { runUI, mergeServe } from '@storyshots/manager';
import { createWorkerSupplier } from '@storyshots/msw-externals/createWorkerSupplier';
import devtools from '@storyshots/react-preview/devtools';
import path from 'path';
import { createPreviewServe } from './createPreviewServe';

export const config: Parameters<typeof runUI>[0] = {
  paths: {
    screenshots: path.join(process.cwd(), 'storyshots', 'screenshots'),
    records: path.join(process.cwd(), 'storyshots', 'records'),
    temp: path.join(process.cwd(), '..', '..', '..', 'temp'),
  },
  preview: mergeServe(createWorkerSupplier(), createPreviewServe()),
  devtools,
};
