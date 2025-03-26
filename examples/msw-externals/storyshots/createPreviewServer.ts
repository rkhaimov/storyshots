import { IPreviewServer } from '@storyshots/core/manager';
import { createWebpackServer } from '@storyshots/webpack';

import config from '../webpack.config';

export async function createPreviewServer(): Promise<IPreviewServer> {
  config.entry = '/storyshots/preview/index.tsx';

  return createWebpackServer(config);
}
