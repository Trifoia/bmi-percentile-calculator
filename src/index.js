'use strict';

const officialBmiData = require('./bmi-data.js');
const generateZPercent = require('./generate-z-percent.js');
const convertDateToAgem = require('./convert-date-to-agem');

/**
 * Original source: https://www.cdc.gov/healthyweight/bmi/bmi_calc.js
 * Takes various data points and generates information about that bmi and bmi percentile
 * 
 * @param {number} kgs Weight in Kilograms
 * @param {number} meters Height in meters
 * @param {string} sex Biological sex. "f" for female and "m" for male
 * @param {number} agem Age in months
 * @param {object} optionalBMIData (optional) BMI data taken from the CDC calculator website
 * 
 * @returns {object} Object with the following fields:
 * - bmi: The calculated bmi
 * - percentile: The calculated bmi percentile
 * - overP95: The percentage over the 95th percentile. Present only if over the 97th percentile
 * - M: The median bmi for this person's age and sex categories,
 * - Z: The number of standard of deviations from the mean
 */
const generateBmiMetric = (kgs, meters, sex, agem, optionalBMIData) => {
  const bmiData = optionalBMIData || officialBmiData;

  sex = sex === 'm' ? '1' : '2';

  // Returning object with calculations
  const calcBmiObj = {
    bmi: -1,
    percentile: 0,
    overP95: 0,
    M: 0,
    Z: 0
  };

  // bmi
  const bmi =  kgs / ( meters * meters );
  calcBmiObj.bmi = Math.round( bmi * 10 ) / 10;

  // Get the correct item from the bmi data
  const bmiDataItem = bmiData.find((item) => {
    return item.Sex === sex && agem + 0.5 === parseFloat(item.Agemos);
  });

  if (!bmiDataItem) {
    // The bmi data item could not be found. This is most likely because the age is too great, just return what we have
    return calcBmiObj;
  }

  const L = parseFloat(bmiDataItem.L);
  const M = parseFloat(bmiDataItem.M);
  const S = parseFloat(bmiDataItem.S);

  // Median
  calcBmiObj.M = M;

  // bmiZ calc
  const bmiZ = (Math.pow(bmi / M, L) - 1) / (S * L);
  calcBmiObj.Z = bmiZ;

  // Percentile calc
  const percentileRaw = generateZPercent(bmiZ) * 100;
  const percentile = Math.round(percentileRaw);
  calcBmiObj.percentile = percentile;

  if (percentileRaw > 97) {
    // Data from bmiData table
    const p95 = parseFloat(bmiDataItem.P95);

    // Calculate over percent
    const overP95 = Math.round( 100 * bmi / p95 );

    calcBmiObj.overP95 = overP95;
  }

  return calcBmiObj;
};

/**
 * Original source: https://www.cdc.gov/healthyweight/bmi/bmi_calc.js
 * Takes various data points and generates information about that bmi and bmi percentile using imperial (english) units
 * 
 * @param {number} lbs Weight in pounds
 * @param {number} inches Height in inches
 * @param {string} sex Biological sex. "f" for female and "m" for male
 * @param {number} agem Age in months
 * @param {object} optionalBMIData (optional) BMI data taken from the CDC calculator website
 * 
 * @returns {object} @see generateBmi
 */
const generateBmiEnglish = (lbs, inches, sex, agem, optionalBMIData) => {
  return generateBmiMetric(lbs * 0.453592, inches * 0.0254, sex, agem, optionalBMIData);
};

module.exports = {
  english: generateBmiEnglish,
  metric: generateBmiMetric,
  convertDateToAgem: convertDateToAgem
};
