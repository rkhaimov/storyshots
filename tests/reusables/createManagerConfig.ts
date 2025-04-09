import { CAPTURE, COMPARE, RUNNER } from '@packages/core/src/server';
import { ManagerConfig } from '@packages/core/src/server/types';
import { createWebpackServer } from '@packages/servers/webpack/src';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { TempFolder } from './test/temp-folder';

export function createManagerConfig(
  devices: ManagerConfig['devices'],
  tf: TempFolder,
): ManagerConfig {
  return {
    devices,
    compare: COMPARE.withLooksSame(),
    capture: CAPTURE.instantly(),
    runner: RUNNER.pool({ agentsCount: 1 }),
    paths: {
      records: tf('records'),
      screenshots: tf('screenshots'),
      temp: tf('temp'),
    },
    preview: createWebpackServer({
      mode: 'development',
      entry: tf('index.tsx'),
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
                    '@babel/preset-env',
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                  ],
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
