import { CAPTURE, COMPARE, RUNNER } from '@storyshots/manager/src';
import { createStoryEngine } from '@storyshots/manager/src/server/modes/createStoryEngine';
import { createManagerRootURL } from '@storyshots/manager/src/server/paths';
import { ManagerConfig } from '@storyshots/manager/src/server/types';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { Action, Arrangers } from './test';
import { CreateTempPath } from './test/env';

export const createManagerTestsFactory = (
  devices: ManagerConfig['devices'],
): Arrangers => [
  async (createTempPath) => {
    fs.writeFileSync(createTempPath('index.tsx'), '');

    const config: ManagerConfig = createConfig(devices, createTempPath);
    const { cleanup } = await createStoryEngine(config);

    return {
      cleanup,
      act: async (page) => {
        // TODO: Act calls are being ignored. They should be recorded
        await page.route('*/**/api/client/act', (route) =>
          route.fulfill({ json: { type: 'success' } }),
        );

        await page.goto(createManagerRootURL(config).href);
      },
    };
  },
];

export const createPreviewTestsFactory = (
  arrangers: Arrangers,
  code: string,
): Arrangers => [
  ...arrangers,
  async (createTempPath) => {
    fs.writeFileSync(createTempPath('index.tsx'), code);

    return {
      cleanup: async () => {},
      act: (page) =>
        Promise.all([
          page.getByLabel('Progress').waitFor({ state: 'visible' }),
          page.waitForLoadState('networkidle'),
        ]),
    };
  },
];

export const createActorTestsFactory = (
  arrangers: Arrangers,
  actions: Action[],
): Arrangers => [
  ...arrangers,
  async () => ({
    cleanup: async () => {},
    act: async (page) => {
      for (const action of actions) {
        await action(page);
      }
    },
  }),
];

function createConfig(
  devices: ManagerConfig['devices'],
  createTempPath: CreateTempPath,
) {
  return {
    devices,
    compare: COMPARE.withLooksSame(),
    capture: CAPTURE.instantly(),
    runner: RUNNER.pool({ agentsCount: 1 }),
    paths: {
      records: createTempPath('records'),
      screenshots: createTempPath('screenshots'),
      temp: createTempPath('temp'),
    },
    preview: createWebpackBundler({
      mode: 'development',
      bail: false,
      entry: createTempPath('index.tsx'),
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
