import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { ServerConfig } from '../reusables/types';

export function createPreviewCompiler(config: ServerConfig) {
  const options = config.overrideWebpackConfig({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: config.previewEntry,
    stats: {
      errorDetails: true,
    },
    output: {
      path: path.join(process.cwd(), 'build', 'preview'),
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
  });

  return webpack(options);
}
