'use strict';

const moment = require('moment');

/**
 * Calculates the number of months ago the given date was compared to
 * a current date (default for current date is Date.now()).
 *
 * @param {string} date The date in YYYY-MM-DD format
 * @param {Date} [now] Date object to use as the current date
 */
const convertDateToAgem = (date, now = Date.now()) => {
  const then = moment(date);
  now = moment(now);

  return now.diff(then, 'months', true);
};

module.exports = convertDateToAgem;
