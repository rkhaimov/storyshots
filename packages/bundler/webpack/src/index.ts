import { PreviewBundler, root } from '@storyshots/manager';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack, { Configuration } from 'webpack';
import dev from 'webpack-dev-middleware';

export function createBundler(
  override: (config: Configuration) => Configuration,
): PreviewBundler {
  return (config) => {
    const compiler = webpack(
      override({
        mode: 'development',
        bail: false,
        devtool: 'cheap-module-source-map',
        entry: config.paths.preview,
        stats: {
          errorDetails: true,
        },
        output: {
          path: path.join(root, 'lib', 'preview'),
          pathinfo: true,
          filename: 'static/js/bundle.js',
          assetModuleFilename: 'static/media/[name].[hash][ext]',
          publicPath: '/preview',
        },
        plugins: [
          new HtmlWebpackPlugin(),
          new webpack.DefinePlugin({
            'process.env': { NODE_ENV: '"development"' },
          }),
        ],
        resolve: {
          alias:
            process.env['STORYSHOTS_BUILD_MODE'] === 'development'
              ? {
                  '@storyshots/react-preview': path.join(
                    path.dirname(
                      require.resolve('@storyshots/react-preview/package.json'),
                    ),
                    'src',
                    'index.tsx',
                  ),
                }
              : {},
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
