# BMI Percentile Calculator

This project defines a Javascript module BmiPercentileCalculator in UMD format.

BmiPercentileCalculator contains functions to calculate the english or metric body-mass index. These functions require a height, weight, and age in months.

BmiPercentileCalculator also contains a convenience function to compute a number of months between two dates. This is needed for the age input for the above functions.

The original source inspiration for the BMI calculation functions `english()` and `metric()` is:

- https://www.cdc.gov/healthyweight/bmi/bmi_calc.js

## Building

This project uses `webpack` to create a UMD Javascript file suitable for use via a `<script>` tag or as a module suitable for inclusion via `import` or `require`.

```
npm install
npm run build
```

## Testing via the Browser

This project includes a simple example `index.html` which includes the built module via a `<script>` tag and performs some basic tests.

To run:

```
npm run serve
# Connect to http://127.0.0.1:8080
```


## Mocha Tests

This project provides Mocha tests which will exercise the library in a NodeJS context using `require` to include the module.

```
npm run test
```


## API

### `BmiPercentileCalculator.convertDateToAgem`

Calculates the number of months ago the given date was compared to now

@param {string} date The date in YYYY-MM-DD format
@param {Date} [now] Date object to use as the current date

### `BmiPercentileCalculator.metric`

Takes various data points and generates information about that bmi and bmi percentile

@param {number} kgs Weight in Kilograms
@param {number} meters Height in meters
@param {string} sex Biological sex. "f" for female and "m" for male
@param {number} agem Age in months
@param {object} optionalBMIData (optional) BMI data taken from the CDC calculator website

@returns {object} Object with the following fields:
- bmi: The calculated bmi
- percentile: The calculated bmi percentile
- overP95: The percentage over the 95th percentile. Present only if over the 97th percentile
- M: The median bmi for this person's age and sex categories,
- Z: The number of standard of deviations from the mean


### `BmiPercentileCalculator.english`

Takes various data points and generates information about that bmi and bmi percentile using imperial (english) units

@param {number} lbs Weight in pounds
@param {number} inches Height in inches
@param {string} sex Biological sex. "f" for female and "m" for male
@param {number} agem Age in months
@param {object} optionalBMIData (optional) BMI data taken from the CDC calculator website

@returns {object} @see generateBmi

## Version History

0.0.1 - Initial migration to a separate repo.

