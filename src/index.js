'use strict';

const officialBmiData = require('./bmi-data.js');
const generateZPercent = require('./generate-z-percent.js');
const convertDateToAgem = require('./convert-date-to-agem');

/**
 * Converts pounds to kilograms
 * 
 * @param {number} lbs Pounds
 */
const lbsToKgs = (lbs) => {
  return lbs * 0.453592;
};

/**
 * Converts kilograms to pounds
 *
 * @param {number} kgs Kilograms
 */
const kgsToLbs = (kgs) => {
  return kgs / 0.453592;
};

/**
 * Converts inches to meters
 *
 * @param {number} inches Inches
 */
const inchesToMeters = (inches) => {
  return inches * 0.0254;
};

/**
 * Converts meters to inches
 *
 * @param {number} meters Meters
 */
const metersToInches = (meters) => {
  return meters / 0.0254;
};

/**
 * Calculate simple BMI
 *
 * @param {number} kgs Mass in kilograms
 * @param {number} meters Height in meters
 */
const calculateBmi = (kgs, meters) => {
  return kgs / ( meters * meters );
};

/**
 * Calculates BMI using english units
 *
 * @param {number} lbs Pounds
 * @param {number} inches Inches
 */
const calculateBmiEnglish = (lbs, inches) => {
  return calculateBmi(lbsToKgs(lbs), inchesToMeters(inches));
};

/**
 * Takes a BMI and height in meters and returns a weight in kilograms
 *
 * @param {number} bmi BMI
 * @param {number} meters Meters
 */
const calculateWeight = (bmi, meters) => {
  return bmi * meters * meters;
};

/**
 * Takes a BMI and height in inches and returns a weight in pounds
 * @param {number} bmi BMI
 * @param {number} inches Inches
 */
const calculateWeightEnglish = (bmi, inches) => {
  return kgsToLbs(calculateWeight(bmi, inchesToMeters(inches)));
};

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
  agem = Math.round(agem);

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
  const bmi =  calculateBmi(kgs, meters);
  calcBmiObj.bmi = Math.round( bmi * 100 ) / 100;

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
  const percentileRaw = generateZPercent(bmiZ);
  const percentile = Number((percentileRaw * 100).toFixed(2));
  calcBmiObj.percentile = percentile;
  calcBmiObj.percentileRaw = percentileRaw;

  if (percentileRaw > 0.97) {
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
  return generateBmiMetric(lbsToKgs(lbs), inchesToMeters(inches), sex, agem, optionalBMIData);
};

/**
 * Takes a percentile, along with other metrics, and returns a weight in kilograms that 
 * corresponds to that percentile. Will return NaN if a percentile cannot be generated with
 * the provided information
 * 
 * @param {number} percentile BMI Percentile value, should be between 0 and 1
 * @param {number} meters Height in meters
 * @param {number} sex Sex identifier. "m" or "f"
 * @param {number} agem Age in months
 * @param {object[]} optionalBMIData (optional) BMI data taken from the CDC calculator website
 */
const weightFromPercentile = (percentile, meters, sex, agem, optionalBMIData) => {
  // TODO: Take a statistics course so that I can actually calculate this value properly
  // instead of relying on this ridiculous brute force method

  // Maximum amount the guessed percentile and actual percentile can be different before a
  // value is returned
  const maxMatchDifference = 0.00000001;
  
  // Start by getting a "reasonable" weight guess by naively assuming a linear relationship
  // between BMI and bmi percentile, starting at 18.5 and ending at 30
  const bmiGuess = (30 - 18.5) * percentile + 18.5;
  let kgs = calculateWeight(bmiGuess, meters);
  let foundPercent = generateBmiMetric(kgs, meters, sex, agem, optionalBMIData).percentileRaw;

  if (typeof foundPercent === 'undefined') {
    // We can't find the percentile for this person, probably because they are too old
    return NaN;
  }
  
  let lowBound = null;
  let highBound = null;
  while (Math.abs(foundPercent - percentile) > maxMatchDifference) {
    if (foundPercent < percentile) {
      // The found percentile was less than we need, increase the kgs and try again
      if (!lowBound || lowBound < foundPercent) lowBound = kgs;
      
      // If we haven't found a high bound yet, double the kg value
      if (!highBound) {
        kgs *= 2;
      } else {
        // Otherwise, chose a value half way in between the current value and the high bound
        kgs = (kgs + highBound) / 2;
      }
    } else {
      // The found percentile was more than we need, decrease the kgs and try again
      if (!highBound || highBound > foundPercent) highBound = kgs;

      // If we haven't found a low bound yet, half the kg value
      if (!lowBound) {
        kgs *= 0.5;
      } else {
        // Otherwise, choose a value half way between the current value and the low bound
        kgs = (lowBound + kgs) / 2;
      }      
    }

    foundPercent = generateBmiMetric(kgs, meters, sex, agem, optionalBMIData).percentileRaw;
  }

  return kgs;
};

const weightFromPercentileEnglish = (percentile, inches, sex, agem, optionalBMIData) => {
  return kgsToLbs(weightFromPercentile(percentile, inchesToMeters(inches), sex, agem, optionalBMIData));
};

module.exports = {
  english: generateBmiEnglish,
  metric: generateBmiMetric,
  convertDateToAgem,
  lbsToKgs,
  kgsToLbs,
  inchesToMeters,
  metersToInches,
  calculateBmi,
  calculateBmiEnglish,
  calculateWeight,
  calculateWeightEnglish,
  weightFromPercentile,
  weightFromPercentileEnglish
};
