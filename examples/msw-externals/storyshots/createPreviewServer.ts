import { IPreviewServer } from '@storyshots/core/manager';
import { createWebpackServer } from '@storyshots/webpack';

import config from '../webpack.config';

export function createPreviewServer(): IPreviewServer {
  config.entry = '/storyshots/preview/index.tsx';

  return createWebpackServer(config);
}
