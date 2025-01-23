import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack, { Configuration } from 'webpack';

import { root } from './root';

const config = {
  mode: 'development',
  bail: false,
  devtool: 'cheap-module-source-map',
  entry: path.join(root, 'src', 'client', 'index.tsx'),
  stats: {
    errorDetails: true,
  },
  output: {
    path: path.join(root, 'lib', 'client'),
    pathinfo: true,
    filename: 'static/js/bundle.js?manager=SECRET',
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
} satisfies Configuration;

export default config;
