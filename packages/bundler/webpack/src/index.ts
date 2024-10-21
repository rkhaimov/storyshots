import { PreviewServe } from '@storyshots/manager';
import { Configuration, webpack } from 'webpack';
import dev from 'webpack-dev-middleware';

export function createWebpackBundler(config: Configuration): PreviewServe {
  const compiler = webpack(config);

  return {
    handler: dev(compiler),
    onUpdate: (handler) =>
      compiler.hooks.done.tap('PreviewUpdate', (stats) => handler(stats.hash)),
  };
}
