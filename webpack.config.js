const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.ts(x?)$/,
            use: [
              'babel-loader',
              'ts-loader'
            ]
          }
        ],

      }
    ]
  },
  externals: {
    react: 'commonjs react'
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js'
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
