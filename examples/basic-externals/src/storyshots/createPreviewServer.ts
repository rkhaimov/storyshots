import { IPreviewServer } from '@storyshots/core/manager';
import { createWebpackServer } from '@storyshots/webpack';
import path from 'path';
import config from '../../webpack.config';

export function createPreviewServer(): IPreviewServer {
  config.entry = path.join(__dirname, 'preview', 'index.tsx');

  return createWebpackServer(config);
}
