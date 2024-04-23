import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';
import { createBundler } from '../../../packages/bundler/webpack/src';
import { run } from '../../../packages/manager/src/run';
import config from '../../../packages/manager/src/server/compiler/manager-config';

run({
  paths: {
    preview: path.join(__dirname, 'preview', 'index.ts'),
    screenshots: path.join(
      process.cwd(),
      'examples',
      'self-test',
      'screenshots',
    ),
    records: path.join(process.cwd(), 'examples', 'self-test', 'records'),
    temp: path.join(process.cwd(), 'temp'),
  },
  bundler: createBundler((config) => ({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: config.entry,
    stats: {
      errorDetails: true,
    },
    output: {
      path: config.output.path,
      pathinfo: true,
      filename: 'static/js/bundle.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: config.output.publicPath,
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
        '@storyshots/core': path.join(process.cwd(), 'packages', 'core', 'src'),
        '@storyshots/react-preview': path.join(
          process.cwd(),
          'packages',
          'preview',
          'react',
          'src',
        ),
        '@storyshots/manager': path.join(
          process.cwd(),
          'packages',
          'manager',
          'src',
        ),
      },
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: true,
        typescript: {
          configOverwrite: {
            compilerOptions: {
              paths: {
                '@storyshots/core': ['./packages/core/src'],
                '@storyshots/react-preview': ['./packages/preview/react/src'],
                '@storyshots/manager': ['./packages/manager/src'],
              },
            },
          },
        },
      }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
    ],
  })),
  createManagerCompiler: () => dev(webpack(config)),
});
