import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { run } from '@storyshots/manager';

run({
  previewEntry: path.join(__dirname, 'preview', 'index.ts'),
  screenshotsPath: path.join(process.cwd(), 'screenshots'),
  recordsPath: path.join(process.cwd(), 'records'),
  tempDirPath: path.join(process.cwd(), 'temp'),
  overridePreviewBuildConfig: (config) => {
    config.module = {
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
    };

    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    };

    config.plugins?.push(new ForkTsCheckerWebpackPlugin({ async: true }));

    return config;
  },
});
