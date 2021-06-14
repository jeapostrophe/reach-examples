# Cmd and Web

This example Reach DApp supports two participants, a seller and a buyer. The seller sells a wise sentence for a price. The buyer buys it. The DApp includes two frontends: a JavaScript command-line frontend and a vanilla webpage frontend. Both use the same backend (`index.rsh` to compiles to `build/index.main.mjs`). The example assumes that you already have the Reach script (`reach`) installed somewhere on your computer.

# Installation

```
% git clone https://github.com/hagenhaus/reach-examples.git
% cd reach-examples/cmd-and-web
```

# Command Version

Run one of the following commands:

```
% REACH_CONNECTOR_MODE=ALGO reach run
% REACH_CONNECTOR_MODE=ETH reach run
```

# Webpage Version

Follow these steps to build and run the webpage version:

1. Change directory: `cd web`.

1. Run `node --version` and verify that your Node version is at least `v16.3.0`.

1. Verify that the AlgoSigner extension is present in your browser.

1. Verify that you have at least to Algorand Wallets (in your account).

1. Run `npm install`.

1. Run `npx webpack --config webpack.config.cjs`.

1. Run `npx http-server`.

1. Browse to [localhost:8080](http://localhost:8080).

1. Copy your AlgoSigner password into your paste buffer. You will need it several times.

1. In *Choose network*, select *Algorand*, and sign in.

1. Click *Deploy Contract*. Continue to interact with AlgoSigner until you see the following sentence in Messages:

    *Seller reports that wisdom is available for purchase at 5 ALGO.*

1. Change to a Buyer wallet that is different from that of the Seller. This is optional.

1. Click *Attach and Buy.* Interact with AlgoSigner a few more times until you see the following sentence in Messages:

    *Buyer's new wisdom is "The best things in life are free."*

# Notes about creating the web version from scratch

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