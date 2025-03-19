import { PreviewServer } from '@storyshots/manager';
import { Configuration, webpack } from 'webpack';
import dev from 'webpack-dev-middleware';

export function createWebpackBundler(config: Configuration): PreviewServer {
  const compiler = webpack(config);

  const middleware = dev(compiler);

  return {
    handler: middleware,
    cleanup: () =>
      new Promise<void>((resolve, reject) =>
        middleware.close((error) => (error ? reject(error) : resolve())),
      ),
    onUpdate: (handler) =>
      compiler.hooks.done.tap('PreviewUpdate', (stats) => handler(stats.hash)),
  };
}
