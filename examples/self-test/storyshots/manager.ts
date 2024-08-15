import { run, STABILIZER } from '@storyshots/manager';
import devtools from '@storyshots/react-preview/devtools';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

run({
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), '..', '..', 'temp'),
  },
  optimization: {
    agentsCount: 4,
    stabilize: STABILIZER.byImage({
      attempts: 3,
      interval: () => 100,
    }),
  },
  preview: createWebpackBundler({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: path.join(__dirname, 'preview', 'index.ts'),
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
      alias: {
        '@storyshots/core': path.join(
          process.cwd(),
          '..',
          '..',
          'packages',
          'core',
          'src',
        ),
      },
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: true,
      }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
    ],
  }),
  devtools,
});
