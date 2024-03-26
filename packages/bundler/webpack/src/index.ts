import { PreviewBundler, root } from '@storyshots/manager';
import path from 'path';
import { Configuration, webpack } from 'webpack';
import dev from 'webpack-dev-middleware';

export type ServConfig = {
  entry: string;
  output: {
    path: string;
    publicPath: string;
  };
};

export function createBundler(
  createConfiguration: (serv: ServConfig) => Configuration,
): PreviewBundler {
  return (config) => {
    const compiler = webpack(
      createConfiguration({
        entry: config.paths.preview,
        output: {
          path: path.join(root, 'lib', 'preview'),
          publicPath: '/preview/',
        },
      }),
    );

    return {
      handle: (app) => {
        app.use(dev(compiler));
      },
      onUpdate: (handler) =>
        compiler.hooks.done.tap('PreviewUpdate', (stats) =>
          handler(stats.hash, false),
        ),
    };
  };
}
