import webpack, { Configuration } from 'webpack';
import path from 'path';
import { root } from './manager-root';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const config: Configuration = {
  mode: 'development',
  bail: false,
  devtool: 'cheap-module-source-map',
  entry: path.join(root, 'src', 'client', 'index.tsx'),
  stats: {
    errorDetails: true,
  },
  output: {
    path: path.join(root, 'lib', 'manager'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    publicPath: '/manager',
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
};
