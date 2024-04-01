import { createBundler } from '../../../packages/bundler/webpack/src';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';
import { run } from '../../../packages/manager/src/run';
import config from '../../../packages/manager/src/server/compiler/manager-config';

run({
  paths: {
    preview: path.join(__dirname, 'preview', 'index.ts'),
    screenshots: path.join(process.cwd(), 'examples', 'demo', 'screenshots'),
    records: path.join(process.cwd(), 'examples', 'demo', 'records'),
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
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({ async: true }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
    ],
  })),
  createManagerCompiler: () => dev(webpack(config)),
});
