import { createWebpackBundler } from '@storyshots/webpack-bundler';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { PreviewBuilder } from './preview';
import { runHeadless } from '../../../packages/manager/src/server/modes/runHeadless';
import path from 'path';
import fs from 'fs';
import { STABILIZER } from '../../../packages/manager/src';

export function createConfigAndCleanup(
  preview: PreviewBuilder,
): Parameters<typeof runHeadless>[0] {
  const temp = path.join(process.cwd(), 'temp');
  const screenshots = path.join(temp, 'screenshots');
  const records = path.join(temp, 'records');

  if (fs.existsSync(temp)) {
    fs.rmSync(temp, { recursive: true });
  }

  return {
    optimization: {
      agentsCount: 1,
      stabilize: STABILIZER.none,
    },
    port: 6006,
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
