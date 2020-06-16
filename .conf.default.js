'use strict';

/**
 * Default configuration file. Any values also present in the .conf.js file will be overridden
 * The configurations have two layers
 * 1. Category
 * 2. Value
 * 
 * This system does not support nesting beyond these two layers. Any object value will
 * be replaced with the entire object value in the secret config
 * 
 * All values marked as `undefined` must be defined in the .conf.js file
 */
module.exports = {
  /**
   * Misc app configurations
   */
  app: {
    /**
     * This text appears in VSCode Intellisense, and this value will be overwritten by the
     * same value in the same category of the secret conf
     */
    value: 'some-value'
  }
};
