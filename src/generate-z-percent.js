'use strict';

/**
 * Original source: https://www.cdc.gov/healthyweight/bmi/bmi_calc.js
 * Takes a number of standard deviations from the mean (z) and returns the percent as a scalar
 * 
 * If z is greater than 3.5 standard deviations, the returned value will be rounded to the nearest integer (|0| or |1|)
 * @param {number} z Number of standard deviations
 */
const generateZPercent = (z) => {
  if (z < -4) { return 0.0; }

  if (z > 4) { return 1.0; }

  var factK = 1;
  var sum = 0;
  var term = 1;
  var k = 0;
  var loopStop = Math.exp(-23);

  while(Math.abs(term) > loopStop) {
    term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
    sum += term;
    k++;
    factK *= k;
  }

  sum += 0.5;

  return sum;
};

module.exports = generateZPercent;
