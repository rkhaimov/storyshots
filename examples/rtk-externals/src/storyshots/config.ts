import { runUI } from '@storyshots/manager';
import devtools from '@storyshots/react-preview/devtools';
import path from 'path';
import { createPreviewServe } from './createPreviewServe';

export const config: Parameters<typeof runUI>[0] = {
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), '..', '..', 'temp'),
  },
  preview: createPreviewServe(),
  devtools,
};
