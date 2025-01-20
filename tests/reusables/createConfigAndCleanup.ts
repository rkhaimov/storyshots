import { createStoryEngine } from '../../packages/manager/src/server/modes/createStoryEngine';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { CAPTURE, COMPARE, RUNNER } from '../../packages/manager/src';
import { PreviewBuilder } from './preview';

export function createConfigAndCleanup(
  preview: PreviewBuilder,
): Parameters<typeof createStoryEngine>[0] {
  const temp = path.join(process.cwd(), 'temp');
  const screenshots = path.join(temp, 'screenshots');
  const records = path.join(temp, 'records');

  if (fs.existsSync(temp)) {
    fs.rmSync(temp, { recursive: true });
  }

  return {
    runner: RUNNER.singleton(),
    capture: CAPTURE.instantly(),
    compare: COMPARE.withLooksSame(),
    paths: {
      screenshots,
      records,
      temp,
    },
    preview: createWebpackBundler({
      mode: 'development',
      bail: false,
      entry: preview.toEntry(),
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
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new webpack.DefinePlugin({
          'process.env': { NODE_ENV: '"development"' },
        }),
      ],
    }),
  };
}
