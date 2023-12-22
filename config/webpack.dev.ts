/// <reference types="webpack-dev-server" />
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { setup } from '../src/server';

const config: webpack.Configuration = {
  devServer: {
    setupMiddlewares: (middlewares, server) => {
      setup(server.app!, 9000).subscribe();

      return middlewares;
    },
    open: {
      target: ['http://localhost:8080'],
      app: {
        name: 'chrome',
        arguments: ['--remote-debugging-port=9000'],
      },
    },
  },
  mode: 'development',
  bail: false,
  devtool: 'cheap-module-source-map',
  entry: path.join(process.cwd(), 'src', 'client', 'index.tsx'),
  stats: {
    errorDetails: true,
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
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
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"development"' } }),
    new ForkTsCheckerWebpackPlugin({ async: true }),
  ],
};

export default config;
