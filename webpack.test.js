const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.html',
      '.json',
      '.css',
      '.scss',
      '.pug'
    ]
  },
  target: 'web',
  devtool: 'source-map',
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular[\/\\]core/,
      path.join(__dirname, 'src')
    ),
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json'
            }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.ts$/,
        exclude: [
          /node_modules/,
          /\.spec\.ts$/,
          /\.e2e\.ts$/,
          /test\.ts$/,
          /session-storage[\\/]/,
          /imports[\\/]/,
          /test\.def\.ts$/,
        ],
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post'
      }
    ]
  }
};
