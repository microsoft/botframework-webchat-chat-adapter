const { join } = require('path');
const { resolve } = require('path');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

let config = {
  entry: {
    'chat-adapter': './lib/index.js'
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    library: 'ChatAdapter',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'dist')
  },
  plugins: [
    new StatsWriterPlugin({
      filename: 'stats.json',
      transform: (_, opts) => JSON.stringify(opts.compiler.getStats().toJson({ chunkModules: true }), null, 2)
    })
  ],
  resolve: {
    // Since Webpack is configured not to transpile, we cannot use package.json/module field to load a module.
    // The default Webpack module resolution order is: "module", then "browser", then "main".
    //
    // De facto entrypoint definitions:
    // - "module": ES.next: transpilation is required for this entrypoint. It should yield code with smallest footprint.
    // - "main": Plain old Node.js or browser: should be ES5 compatible. It may be configured to work only on either Node.js or browser.
    // - "browser": Plain old browsers (ES5, which is supported by IE9). This entrypoint will not work on Node.js.
    //
    // If both "main" and "browser" are present, "main" will be for Node.js and "browser" will be for browsers.
    mainFields: ['browser', 'main']
  }
};

// VSTS always emits uppercase environment variables.
const node_env = process.env.node_env || process.env.NODE_ENV;

// Source maps are only added to development bits because of being slow to load in the browser.
// - "eval-source-map" took 1.6s to load in browser, 1.5s to rebuild
// - "source-map" took 500ms to load, 5s to rebuild
// - No source map took 300ms to load
// "Cheap modules" does not have column information, thus, breakpoint does not work correctly.
if (node_env !== 'production' && node_env !== 'test') {
  config = {
    ...config,
    devtool: 'eval-source-map',
    mode: 'development',
    module: {
      ...config.module,
      rules: [
        ...((config.module || {}).rules || []),
        {
          enforce: 'pre',
          include: [
            join(__dirname, './lib')
          ],
          test: /\.js$/,
          use: ['source-map-loader']
        }
      ]
    },
    output: {
      ...config.output,
      devtoolNamespace: 'chat-adapter'
    }
  };
}

module.exports = config;
