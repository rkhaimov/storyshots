import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { run } from '../../src/server';

run({
  clientEntry: path.join(
    process.cwd(),
    'example',
    'storyshots',
    'client',
    'index.ts',
  ),
  screenshotsPath: path.join(process.cwd(), 'screenshots'),
  recordsPath: path.join(process.cwd(), 'records'),
  tempPath: path.join(process.cwd(), 'temp'),
  overrideWebpackConfig: (config) => {
    config.module = {
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
    };

    config.resolve = {
      extensions: ['.js', '.ts', '.tsx'],
    };

    config.plugins?.push(new ForkTsCheckerWebpackPlugin({ async: true }));

    return config;
  },
});
