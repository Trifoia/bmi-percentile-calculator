'use strict';

/**
 * Some common and simple utilities used across most projects
 */
const utils = {
  /**
   * Returns true if the app is running in debug mode, false otherwise
   */
  isDebug: () => {
    return process.argv.includes('--debug');
  },

  /**
   * Returns true if the app is running in test mode, false otherwise
   */
  isTest: () => {
    return process.argv.includes('--test');
  },

  /**
   * Returns true if the app is running in quick mode, false otherwise
   */
  isQuick: () => {
    return process.argv.includes('--quick');
  }
};

module.exports = utils;
