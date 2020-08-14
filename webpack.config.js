'use strict';

const path = require('path');

// https://webpack.js.org/configuration/output/

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'BmiPercentileCalculator',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bmi-percentile-calculator.js',
    auxiliaryComment: 'Test Comment',
    globalObject: 'this'
  },
  mode: 'production'
};