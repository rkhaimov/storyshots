import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const config: webpack.Configuration = {
  mode: 'development',
  bail: false,
  devtool: 'cheap-module-source-map',
  entry: path.join(process.cwd(), 'src', 'index.tsx'),
  stats: {
    errorDetails: true,
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
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
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"development"' } }),
  ],
};

export default config;
