'use strict';

/*
  This configuration utility is designed to allow the definition of
  important constants in a way that is compatible with VSCode Intellisense.

  Secret (ignored) configurations can be set in a `.conf.js` file, and will
  overwrite default configurations. Environment variables can also be used to define
  string values, using the following format for the key:
  `NODE_CONF_${categoryKey}_${valueKey}`

  This utility expects there to be a `.conf.default.js` file in the same directory. The
  secret config file is optional

  See the default config for details on file formatting

  The config object will only get values from the related conf files the first time
  it is imported. Use the `config.loadConfig` method to force a read from file
*/

const config = require('./.conf.default.js');
let secretConfig = {};
try {
  secretConfig = require('./.conf.js');
} catch(e) {
  // Allow error
}

/**
 * Array containing falsy values that are explicitly permitted
 */
const allowedFalsyValues = [
  '',
  0,
  null
];

/**
 * Simple helper determines if a value exists in a config object
 *
 * @param {object} obj Object to check
 * @param {string} categoryKey Category to check
 * @param {string} valueKey Name of the value to check
 */
const checkExists = (obj, categoryKey, valueKey) => {
  return obj[categoryKey] && (obj[categoryKey][valueKey] || allowedFalsyValues.includes(obj[categoryKey][valueKey]));
};

/**
 * Helper function recursively travels a provided object and returns "false" if any values are undefined. A log
 * will also be automatically made to stderr detailing the nature of the failure
 * 
 * @param {object} obj The object to check
 * @param {string} originalKey The key related to the object being checked
 */
const checkForUndefinedRecursive = (obj, originalKey = 'this') => {
  if (typeof obj === 'undefined') {
    console.error(`Item with key ${originalKey} is undefined`);
    return false;
  }

  // Don't check strings
  if (typeof obj === 'string') return true;

  // For-in statements don't run on non-indexed datatypes
  for (const key in obj) {
    const item = obj[key];

    if (!checkForUndefinedRecursive(item, key)) return false;
  }

  return true;
};

/**
 * Method will load config values into the config object. Can be used to re-initialize the config
 * object, if needed
 *
 * @param {object} configOpts Overrides for any currently set config options
 */
const loadConfig = (configOpts = null) => {
  for (const categoryKey in config) {
    const category = config[categoryKey];

    for (const valueKey in category) {
      // Check for the value in the configuration options provided as an argument
      if (configOpts && checkExists(configOpts, categoryKey, valueKey)) {
        category[valueKey] = configOpts[categoryKey][valueKey];
        continue;
      }

      // Check for the value in the secret config
      if (checkExists(secretConfig, categoryKey, valueKey)) {
        category[valueKey] = secretConfig[categoryKey][valueKey];
        continue;
      }

      // Check for the value in environment vars
      const varName = `NODE_CONF_${categoryKey}_${valueKey}`;
      if (process.env[varName]) {
        category[valueKey] = process.env[varName];
        continue;
      }
    }
  }

  if (!checkForUndefinedRecursive(this)) {
    throw new Error('Undefined configurations detected');
  }
};

loadConfig();

config.loadConfig = loadConfig;
module.exports = config;
