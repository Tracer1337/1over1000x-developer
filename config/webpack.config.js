'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      content: PATHS.src + '/content.ts',
      background: PATHS.src + '/background.ts',
      popup: PATHS.src + '/popup.tsx',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
