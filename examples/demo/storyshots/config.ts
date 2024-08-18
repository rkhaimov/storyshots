import { runUI, STABILIZER } from '../../../packages/manager/src';
import path from 'path';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from 'webpack';
import devtools from '@storyshots/react-preview/devtools';

export const config: Parameters<typeof runUI>[0] = {
  paths: {
    screenshots: path.join(process.cwd(), 'examples', 'demo', 'screenshots'),
    records: path.join(process.cwd(), 'examples', 'demo', 'records'),
    temp: path.join(process.cwd(), 'temp'),
  },
  optimization: {
    agentsCount: 4,
    stabilize: STABILIZER.byImage({
      attempts: 5,
      interval: (attempt) => 100 * Math.pow(2, attempt),
    }),
  },
  preview: createWebpackBundler({
    mode: 'development',
    bail: false,
    entry: path.join(__dirname, 'preview', 'index.ts'),
    devtool: 'cheap-module-source-map',
    stats: {
      errorDetails: true,
    },
    output: {
      pathinfo: true,
      filename: 'static/js/bundle.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|js)x?$/,
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
      alias: {
        '@storyshots/core': path.join(process.cwd(), 'packages', 'core', 'src'),
        '@storyshots/react-preview': path.join(
          process.cwd(),
          'packages',
          'preview',
          'react',
          'src',
        ),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({ async: true }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
    ],
  }),
  devtools,
};
