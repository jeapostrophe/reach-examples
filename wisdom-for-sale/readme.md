# Wisdom for Sale

## Requirements

1. `node v16.3.0`
1. Reach

## Installation

1. `reach scaffold`

1. `reach init`

1. Replace with [index.mjs](https://github.com/reach-sh/reach-lang/blob/master/examples/overview/index.mjs) and [index.rsh](https://github.com/reach-sh/reach-lang/blob/master/examples/overview/index.rsh).

1. Search and replace `Alice` with `Seller`, `Bob` with `Buyer`, `A` with `S`, `secret` with `wisdom`, `info` with `wisdom`, `request` with `price`. 

1. `make run`

1. `npm i http-server`

1. `npm i webpack@4.46.0`

1. `npm i -D webpack-cli@4.7.2`

1. `npm i dotenv`

1. `touch .env`

1. `npm i @reach-sh/stdlib`

1. `npm i net`

1. `touch scripts.js`

    ```
    import * as stdlib from '@reach-sh/stdlib/ALGO.mjs';
    import * as backend from './build/index.main.mjs';
    ```

1. `touch webpack.config.cjs`

    ```
    const path = require('path');
    const webpack = require('webpack')
    const dotenv = require('dotenv')

    module.exports = {
      entry: './node_modules/@reach-sh/stdlib/ALGO.mjs',
      mode: 'development',
      output: {
        filename: 'reach-stdlib.js',
        path: path.resolve(__dirname, './'),
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(dotenv.config().parsed)
        })
      ]
    };
    ```

1. `npx webpack --config webpack.config.cjs`

    ```
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
    ```

1. `touch styles.css`

1. `touch index.html`

1. `npx http-server`

1. [localhost:8080](http://localhost:8080)