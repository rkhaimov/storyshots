import express from 'express';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import history from 'connect-history-api-fallback';
import wsify from 'express-ws';
import { createWebDriver } from '../createWebDriver';
import { ServerConfig } from '../reusables/types';
import { createPreviewWatcher } from './createPreviewWatcher';

export function runManagerCompilation(config: ServerConfig) {
  const compiler = webpack({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: path.join(process.cwd(), 'src', 'client', 'Manager', 'index.tsx'),
    stats: {
      errorDetails: true,
    },
    output: {
      path: path.join(process.cwd(), 'build'),
      pathinfo: true,
      filename: 'static/js/manager.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.tsx?$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'entry',
                      corejs: 3,
                    },
                  ],
                  [
                    '@babel/preset-react',
                    { runtime: 'automatic', development: true },
                  ],
                  '@babel/preset-typescript',
                ],
                plugins: ['babel-plugin-styled-components'],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
      new ForkTsCheckerWebpackPlugin({ async: true }),
    ],
  });

  const { app } = wsify(express());

  app.use(history({ htmlAcceptHeaders: ['text/html'] }));
  app.use(middleware(compiler));

  const onPreviewUpdate = createPreviewWatcher(app);

  createWebDriver(app, config);

  app.listen(8080, () => console.log('Manager is served at 8080'));

  return onPreviewUpdate;
}
