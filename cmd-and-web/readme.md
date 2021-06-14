# Cmd and Web

This example Reach DApp supports two participants, a seller and a buyer. The seller sells a wise sentence for a price. The buyer buys it. The DApp includes two frontends: a JavaScript command-line frontend and a vanilla webpage frontend. Both use the same backend (`index.rsh` to compiles to `build/index.main.mjs`). The example assumes that you already have the Reach script (`reach`) installed somewhere on your computer.

# Command Version

Run the command-line version like this:

1. Change directory to the root of this repository (`cmd-and-web`).

1. Run one of the following commands:

    ```
    % REACH_CONNECTOR_MODE=ALGO reach run
    % REACH_CONNECTOR_MODE=ETH reach run
    ```

# Webpage Version

1. `mkdir web` and `cd web`

1. `npm init -y` and add `"type": "module"` to package.json.

1. `npm i http-server`

1. `npm i webpack@4.46.0`

    ```
    npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
    npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
    npm WARN deprecated fsevents@1.2.13: fsevents 1 will break on node v14+ and could be using insecure binaries. Upgrade to fsevents 2.
    npm WARN deprecated chokidar@2.1.8: Chokidar 2 will break on node v14+. Upgrade to chokidar 3 with 15x less dependencies.
    ```

1. `npm i -D webpack-cli@4.7.2`

1. `npm i dotenv`

1. `touch .env`

1. `npm i @reach-sh/stdlib`

1. `npm i net`

    ```
    To address all issues (including breaking changes), run: npm audit fix --force
    Run `npm audit` for details.
    ```

1. `touch scripts.js`

1. `touch webpack.config.cjs`

    ```
    const path = require('path');
    const webpack = require('webpack')
    const dotenv = require('dotenv')

    module.exports = {
      entry: './scripts.js',
      mode: 'development',
      output: {
        filename: 'reach-webpack.js',
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

1. `touch styles.css`

1. `touch index.html`

1. `npx http-server`

1. [localhost:8080](http://localhost:8080)