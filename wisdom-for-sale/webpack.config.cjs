const path = require('path');
const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = {
  entry: './scripts.js',
  mode: 'development',
  output: {
    filename: 'webpack.js',
    path: path.resolve(__dirname, './'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    })
  ]
};