import express from 'express';
import middleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export function runPreviewCompilation(onHashChange: (hash: string) => void) {
  const app = express();

  const compiler = webpack({
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: path.join(process.cwd(), 'example', 'storyshots', 'index.ts'),
    stats: {
      errorDetails: true,
    },
    output: {
      path: path.join(process.cwd(), 'build', 'preview'),
      pathinfo: true,
      filename: 'static/js/preview.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: '/',
    },
    module: {
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
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
      new ForkTsCheckerWebpackPlugin({ async: true }),
    ],
  });

  app.use(middleware(compiler));

  compiler.hooks.done.tap('PreviewUpdate', (stats) => onHashChange(stats.hash));

  app.listen(3030, () => console.log('Preview is served at 3030'));
}
