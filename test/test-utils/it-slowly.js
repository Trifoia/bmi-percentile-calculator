'use strict';

const { isQuick } = require('../../utils.js');

/**
 * Method should be used for long running tests instead of the `it` function. Tests made with this function will be
 * skipped using it.skip - so they will still appear in the test report as "pending"
 * 
 * @param {string} description Custom timeout for the long running test
 * @param {function} fn Function containing the test to run
 */
module.exports = async function (description, fn) {
  if (isQuick()) return it.skip(description, fn);

  return (await it(description, fn));
};
