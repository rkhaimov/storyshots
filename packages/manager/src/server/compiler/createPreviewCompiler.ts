import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { ServerConfig } from '../reusables/types';
import { root } from './manager-root';

export function createPreviewCompiler(config: ServerConfig) {
  const options = config.overridePreviewBuildConfig({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: config.previewEntry,
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
  });

  return webpack(options);
}
