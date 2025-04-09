import HtmlWebpackPlugin from 'html-webpack-plugin';
import 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';

const config: Configuration = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    proxy: [
      {
        changeOrigin: true,
        context: '/api',
        target: 'https://petstore.swagger.io/v2',
        pathRewrite: {
          '^/api': '',
        },
      },
    ],
  },
  mode: 'development',
  bail: false,
  entry: './src/index.tsx',
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
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
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
};

export default config;
