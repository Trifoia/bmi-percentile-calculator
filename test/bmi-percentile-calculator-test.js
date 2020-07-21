'use strict';

const assert = require('assert');

const bmiData = require('./test-utils/test-bmi-data.js');
const BmiPercentileCalculator = require('../dist/bmi-percentile-calculator.js');

describe('bmi-percentile-calculator', function() {
  it('should correctly calculate ages', async () => {
    const now = new Date(2020, 6, 4);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2020-07-04', now), 0);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2019-07-04', now), 12);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2018-07-04', now), 24);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2017-07-04', now), 36);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2016-07-04', now), 48);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2015-07-04', now), 60);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2014-07-04', now), 72);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2007-03-07', now), 159.9);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2000-01-01', now), 246.09677419354838);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2014-01-20', now), 77.46666666666667);
    assert.strictEqual(BmiPercentileCalculator.convertDateToAgem('2003-06-29', now), 204.16666666666666);
  });

  it('should generate correct BMI values', async () => {
    const check = (actual, expected) => {
      assert.equal(actual.bmi, expected.bmi);
      assert.equal(actual.percentile, expected.percentile);
      assert.equal(actual.overP95, expected.overP95);
      assert.equal(actual.M.toFixed(3), expected.M.toFixed(3));
      assert.equal(actual.Z.toFixed(3), expected.Z.toFixed(3));
    };
    check(BmiPercentileCalculator.english(14, 24, 'f', 45, bmiData), {
      bmi: 17.1,
      percentile: 88,
      overP95: 0,
      M: 15.37335154,
      Z: 1.1695501694685717
    });

    check(BmiPercentileCalculator.english(20, 24, 'f', 90), {
      bmi: 24.4,
      percentile: 99,
      overP95: 121,
      M: 15.6251988,
      Z: 2.3023581064456002
    });

    check(BmiPercentileCalculator.english(40, 40, 'f', 180), {
      bmi: 17.6,
      percentile: 17,
      overP95: 0,
      M: 19.9305662,
      Z: -0.9515010505319098
    });

    check(BmiPercentileCalculator.english(36, 43, 'f', 90, bmiData), {
      bmi: 13.7,
      percentile: 8,
      overP95: 0,
      M: 15.6251988,
      Z: -1.4356662429114826
    });

    check(BmiPercentileCalculator.english(14, 24, 'm', 45, bmiData), {
      bmi: 17.1,
      percentile: 87,
      overP95: 0,
      M: 15.70613566,
      Z: 1.1056912339515312
    });

    check(BmiPercentileCalculator.english(20, 24, 'm', 90, bmiData), {
      bmi: 24.4,
      percentile: 99,
      overP95: 125,
      M: 15.63170735,
      Z: 2.416604382916007
    });

    check(BmiPercentileCalculator.english(20, 24, 'm', 90.2, bmiData), {
      bmi: 24.4,
      percentile: 99,
      overP95: 125,
      M: 15.63170735,
      Z: 2.416604382916007
    });

    check(BmiPercentileCalculator.english(40, 40, 'm', 180, bmiData), {
      bmi: 17.6,
      percentile: 15,
      overP95: 0,
      M: 19.85766121,
      Z: -1.0314390524206944
    });

    check(BmiPercentileCalculator.english(36, 43, 'm', 90, bmiData), {
      bmi: 13.7,
      percentile: 4,
      overP95: 0,
      M: 15.63170735,
      Z: -1.7119358672696052
    });

    check(BmiPercentileCalculator.english(160, 64, 'm', 300, bmiData), {
      bmi: 27.5,
      percentile: 0,
      overP95: 0,
      M: 0,
      Z: 0
    });
  });
});
