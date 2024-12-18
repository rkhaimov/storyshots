import { runUI, STABILIZER } from '@storyshots/manager';
import devtools from '@storyshots/react-preview/devtools';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

export const config: Parameters<typeof runUI>[0] = {
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), '..', '..', 'temp'),
  },
  optimization: {
    agentsCount: 4,
    retries: 3,
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
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"', TESTING: true },
      }),
    ],
  }),
  devtools,
};
