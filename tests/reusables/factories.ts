import { Page } from '@playwright/test';
import { CAPTURE, COMPARE, RUNNER } from '@storyshots/manager/src';
import { createStoryEngine } from '@storyshots/manager/src/server/modes/createStoryEngine';
import { runInBackground } from '@storyshots/manager/src/server/modes/runInBackground';
import { createManagerRootURL } from '@storyshots/manager/src/server/paths';
import { ManagerConfig } from '@storyshots/manager/src/server/types';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import {
  createEmptyDescription,
  hasSetup,
  onRun,
  onSetup,
  TestDescription,
  onJoinAct,
} from './test/description';
import { CreateTempPath } from './test/env';

export const createCITestsFactory = (devices: ManagerConfig['devices']) =>
  onRun(createEmptyDescription(), async (createTP) =>
    runInBackground(createConfig(devices, createTP)),
  );

export const createUITestsFactory = (devices: ManagerConfig['devices']) =>
  onRun(createEmptyDescription(), async (createTP, page) => {
    const config: ManagerConfig = createConfig(devices, createTP);
    const { cleanup } = await createStoryEngine(config);

    return {
      cleanup,
      run: async () => {
        // TODO: Act calls are being ignored. They should be recorded
        await page.route('*/**/api/client/act', (route) =>
          route.fulfill({ json: { type: 'success' } }),
        );

        await page.goto(createManagerRootURL(config).href);
      },
    };
  });

export const createPreviewTestsFactory = (
  description: TestDescription,
  code: string,
) => {
  if (!hasSetup(description)) {
    return onSetup(description, async (createTP) =>
      fs.writeFileSync(createTP('index.tsx'), code),
    );
  }

  return onJoinAct(description, async (createTP, page) => {
    fs.writeFileSync(createTP('index.tsx'), code);

    // TODO: Do not need these, probably
    return Promise.all([
      page.getByLabel('Progress').waitFor({ state: 'visible' }),
      page.waitForLoadState('networkidle'),
    ]);
  });
};

export type Action = (page: Page) => Promise<unknown>;

export const createActorTestsFactory = (
  description: TestDescription,
  action: Action,
) => onJoinAct(description, async (_, page) => action(page));

function createConfig(
  devices: ManagerConfig['devices'],
  createTP: CreateTempPath,
) {
  return {
    devices,
    compare: COMPARE.withLooksSame(),
    capture: CAPTURE.instantly(),
    runner: RUNNER.pool({ agentsCount: 1 }),
    paths: {
      records: createTP('records'),
      screenshots: createTP('screenshots'),
      temp: createTP('temp'),
    },
    preview: createWebpackBundler({
      mode: 'development',
      bail: false,
      entry: createTP('index.tsx'),
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
