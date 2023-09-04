'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      content: PATHS.src + '/content/index.ts',
      background: PATHS.src + '/background/index.ts',
      offscreen: PATHS.src + '/offscreen/index.ts',
      popup: PATHS.src + '/popup/index.tsx',
      options: PATHS.src + '/options/index.tsx',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
