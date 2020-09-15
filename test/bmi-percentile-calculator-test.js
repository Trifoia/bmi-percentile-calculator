'use strict';

const assert = require('assert');

const bmiData = require('./test-utils/test-bmi-data.js');
const calculator = require('../dist/bmi-percentile-calculator.js');
// const calculator = require('../src/index.js');

describe('bmi-percentile-calculator', function() {
  it('should correctly calculate ages', async () => {
    const now = new Date(2020, 6, 4);
    assert.strictEqual(calculator.convertDateToAgem('2020-07-04', now), 0);
    assert.strictEqual(calculator.convertDateToAgem('2019-07-04', now), 12);
    assert.strictEqual(calculator.convertDateToAgem('2018-07-04', now), 24);
    assert.strictEqual(calculator.convertDateToAgem('2017-07-04', now), 36);
    assert.strictEqual(calculator.convertDateToAgem('2016-07-04', now), 48);
    assert.strictEqual(calculator.convertDateToAgem('2015-07-04', now), 60);
    assert.strictEqual(calculator.convertDateToAgem('2014-07-04', now), 72);
    assert.strictEqual(calculator.convertDateToAgem('2007-03-07', now), 159.9);
    assert.strictEqual(calculator.convertDateToAgem('2000-01-01', now), 246.09677419354838);
    assert.strictEqual(calculator.convertDateToAgem('2014-01-20', now), 77.46666666666667);
    assert.strictEqual(calculator.convertDateToAgem('2003-06-29', now), 204.16666666666666);
  });

  it('should generate correct BMI values', async () => {
    const check = (actual, expected) => {
      assert.strictEqual(actual.bmi, expected.bmi);
      assert.strictEqual(actual.percentile, expected.percentile);
      assert.strictEqual(actual.overP95, expected.overP95);
      assert.strictEqual(actual.M.toFixed(3), expected.M.toFixed(3));
      assert.strictEqual(actual.Z.toFixed(3), expected.Z.toFixed(3));
    };
    let actual = calculator.english(14, 24, 'f', 45, bmiData);
    check(actual, {
      bmi: 17.09,
      percentile: 87.89,
      overP95: 0,
      M: 15.37335154,
      Z: 1.1695501694685717
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 24, 'f', 45, bmiData) - 14) <= 0.01);

    actual = calculator.english(20, 24, 'f', 90, bmiData);
    check(actual, {
      bmi: 24.41,
      percentile: 98.93,
      overP95: 121,
      M: 15.6251988,
      Z: 2.3023581064456002
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 24, 'f', 90, bmiData) - 20) <= 0.01);

    actual = calculator.english(40, 40, 'f', 180, bmiData);
    check(actual, {
      bmi: 17.58,
      percentile: 17.07,
      overP95: 0,
      M: 19.9305662,
      Z: -0.9515010505319098
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 40, 'f', 180, bmiData) - 40) <= 0.01);

    actual = calculator.english(36, 43, 'f', 90, bmiData);
    check(actual, {
      bmi: 13.69,
      percentile: 7.55,
      overP95: 0,
      M: 15.6251988,
      Z: -1.4356662429114826
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 43, 'f', 90, bmiData) - 36) <= 0.01);

    actual = calculator.english(14, 24, 'm', 45, bmiData);
    check(actual, {
      bmi: 17.09,
      percentile: 86.56,
      overP95: 0,
      M: 15.70613566,
      Z: 1.1056912339515312
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 24, 'm', 45, bmiData) - 14) <= 0.01);

    actual = calculator.english(20, 24, 'm', 90, bmiData);
    check(actual, {
      bmi: 24.41,
      percentile: 99.22,
      overP95: 125,
      M: 15.63170735,
      Z: 2.416604382916007
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 24, 'm', 90, bmiData) - 20) <= 0.01);

    actual = calculator.english(20, 24, 'm', 90.2, bmiData);
    check(actual, {
      bmi: 24.41,
      percentile: 99.22,
      overP95: 125,
      M: 15.63170735,
      Z: 2.416604382916007
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 24, 'm', 90.2, bmiData) - 20) <= 0.01);

    actual = calculator.english(40, 40, 'm', 180, bmiData);
    check(actual, {
      bmi: 17.58,
      percentile: 15.12,
      overP95: 0,
      M: 19.85766121,
      Z: -1.0314390524206944
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 40, 'm', 180, bmiData) - 40) <= 0.01);

    actual = calculator.english(36, 43, 'm', 90, bmiData);
    check(actual, {
      bmi: 13.69,
      percentile: 4.35,
      overP95: 0,
      M: 15.63170735,
      Z: -1.7119358672696052
    });
    assert.ok(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 43, 'm', 90, bmiData) - 36) <= 0.01);

    actual = calculator.english(160, 64, 'm', 300, bmiData);
    check(actual, {
      bmi: 27.46,
      percentile: 0,
      overP95: 0,
      M: 0,
      Z: 0
    });
    assert.ok(isNaN(Math.abs(calculator.weightFromPercentileEnglish(actual.percentileRaw, 64, 'm', 300, bmiData) - 160)));
  });
});
