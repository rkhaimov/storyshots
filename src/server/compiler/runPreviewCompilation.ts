import express from 'express';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import { ServerConfig } from '../reusables/types';

export function runPreviewCompilation(
  config: ServerConfig,
  onHashChange: (hash: string) => void,
) {
  const app = express();

  const options = config.overrideWebpackConfig({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: config.clientEntry,
    stats: {
      errorDetails: true,
    },
    output: {
      path: path.join(process.cwd(), 'build', 'preview'),
      pathinfo: true,
      filename: 'static/js/preview.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
    ],
  });

  const compiler = webpack(options);

  app.use(middleware(compiler));

  compiler.hooks.done.tap('PreviewUpdate', (stats) => onHashChange(stats.hash));

  app.listen(3030, () => console.log('Preview is served at 3030'));
}
