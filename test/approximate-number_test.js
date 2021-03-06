'use strict';
var assert = require('assert'),
  format = require('util').format,
  approximateNumber = require('../lib/approximate-number.js');

describe('approximate-number', function() {

  describe('default options', function() {
    // input => output
    var tests = {
      0: '0',
      0.1: '0.1',
      1: '1',
      10: '10',
      999: '999',
      1000: '1k',
      1001: '1k',
      1234: '1.2k',
      9999: '9.9k',
      10000: '10k',
      10000.1: '10k',
      10500: '10k',
      10999: '10k',
      11111: '11k',
      111111: '111k',
      1000000: '1m',
      1111111: '1.1m',
      12345678: '12m',
      1000000000: '1b',
      1500000000: '1.5b',
      9500000000: '9.5b',
      9050000000: '9b',
      10000000000: '10b',
      10500000000: '10b',
      1000000000000: '1t',
      10000000000000: '10t',
      19939034457936: '19t',
      9007199254740991: '9,007t' // Number.MAX_SAFE_INTEGER, 2^53-1
    };

    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s', input, expected), function() {
        assert.equal( approximateNumber(input), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s', input, expected), function () {
        assert.equal(approximateNumber(input), expected);
      });
    });
  });

  describe('options.min10k', function() {
    var options = {
      min10k: true
    };

    // input => output
    var tests = {
      0: '0',
      0.1: '0.1',
      1: '1',
      10: '10',
      999: '999',
      1000: '1,000',
      1001: '1,001',
      1234: '1,234',
      9999: '9,999',
      10000: '10k',
      10000.1: '10k',
      10500: '10k',
      999000: '999k'
    };

    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s with min10k option', input, expected), function() {
        assert.equal( approximateNumber(input, options), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s with min10k option', input, expected), function () {
        assert.equal(approximateNumber(input, options), expected);
      });
    });
  });

  describe('options.capital', function() {
    var options = {
      capital: true
    };

    // input => output
    var tests = {
      1000: '1K',
      1000000: '1M',
      1000000000: '1B',
      1500000000: '1.5B',
      1000000000000: '1T',
      10000000000000: '10T',
      9007199254740991: '9,007T' // Number.MAX_SAFE_INTEGER, 2^53-1
    };

    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s capital option', input, expected), function() {
        assert.equal( approximateNumber(input, options), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s capital option', input, expected), function () {
        assert.equal(approximateNumber(input, options), expected);
      });
    });
  });

  describe('options.separator=false', function() {
    var options = {
      separator: false,
      min10k: true
    };

    // input => output
    var tests = {
      0: '0',
      0.1: '0.1',
      1: '1',
      10: '10',
      999: '999',
      1000: '1000',
      1001: '1001',
      1234: '1234',
      9999: '9999',
      10000: '10k',
      9007199254740991: '9007t' // Number.MAX_SAFE_INTEGER, 2^53-1
    };



    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s separator=false', input, expected), function() {
        assert.equal( approximateNumber(input, options), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s separator=false', input, expected), function () {
        assert.equal(approximateNumber(input, options), expected);
      });
    });

    it('should allow for an alternative separator', function() {
      var actual = approximateNumber(1234, {separator: '.', min10k: true});
      assert.equal(actual, '1.234');
    });
  });

  describe('prefix/suffix', function(){
    it('should add the prefix', function() {
      assert.equal(approximateNumber(12345, {prefix: '$'}), '$12k');
    });
    it('should add the suffix', function() {
      assert.equal(approximateNumber(12345, {suffix: '%'}), '12k%');
    });
  });

  describe('options.round', function() {
    var options = {
      round: true
    };

    // input => output
    var tests = {
      0: '0',
      0.1: '0.1',
      1: '1',
      10: '10',
      999: '999',
      1000: '1k',
      1001: '1k',
      1234: '1.2k',
      9999: '10k',
      10000: '10k',
      10000.1: '10k',
      10500: '11k',
      10999: '11k',
      11111: '11k',
      111111: '111k',
      1000000: '1m',
      1111111: '1.1m',
      12345678: '12m',
      1000000000: '1b',
      1500000000: '1.5b',
      9500000000: '9.5b',
      9050000000: '9.1b',
      10000000000: '10b',
      10500000000: '11b',
      1000000000000: '1t',
      10000000000000: '10t',
      19939034457936: '20t',
      9007199254740991: '9,007t' // Number.MAX_SAFE_INTEGER, 2^53-1
    };

    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s', input, expected), function() {
        assert.equal( approximateNumber(input, options), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s', input, expected), function () {
        assert.equal(approximateNumber(input, options), expected);
      });
    });
  });

  describe('options.decimal', function() {
    var options = {
      decimal: false
    };

    // input => output
    var tests = {
      0: '0',
      0.1: '0',
      1: '1',
      10: '10',
      999: '999',
      1000: '1k',
      1001: '1k',
      1234: '1k',
      9999: '9k',
      10000: '10k',
      10000.1: '10k',
      10500: '10k',
      10999: '10k',
      11111: '11k',
      111111: '111k',
      1000000: '1m',
      1111111: '1m',
      12345678: '12m',
      1000000000: '1b',
      1500000000: '1b',
      9500000000: '9b',
      9050000000: '9b',
      10000000000: '10b',
      10500000000: '10b',
      1000000000000: '1t',
      10000000000000: '10t',
      19939034457936: '19t',
      9007199254740991: '9,007t' // Number.MAX_SAFE_INTEGER, 2^53-1
    };

    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s', input, expected), function() {
        assert.equal( approximateNumber(input, options), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s', input, expected), function () {
        assert.equal(approximateNumber(input, options), expected);
      });
    });

    it('should allow the decimal character to be changed', function() {
      var actual = approximateNumber(1234, {decimal: ','});
      assert.equal(actual, '1,2k');
    });
  });

  describe('options.decimal=false and options.round=true', function() {
    var options = {
      round: true,
      decimal: false
    };

    // input => output
    var tests = {
      0: '0',
      0.1: '0',
      1: '1',
      10: '10',
      999: '999',
      1000: '1k',
      1001: '1k',
      1234: '1k',
      9999: '10k',
      10000: '10k',
      10000.1: '10k',
      10500: '11k',
      10999: '11k',
      11111: '11k',
      111111: '111k',
      1000000: '1m',
      1111111: '1m',
      1500000: '2m',
      12345678: '12m',
      1000000000: '1b',
      1500000000: '2b',
      9500000000: '10b',
      9050000000: '9b',
      10000000000: '10b',
      10500000000: '11b',
      1000000000000: '1t',
      10000000000000: '10t',
      19939034457936: '20t',
      9007199254740991: '9,007t' // Number.MAX_SAFE_INTEGER, 2^53-1
    };

    // positive number tests
    Object.keys(tests).forEach(function(input) {
      var expected = tests[input];
      it(format('should convert %s to %s', input, expected), function() {
        assert.equal( approximateNumber(input, options), expected);
      });
    });

    // negative number tests - skip 0
    Object.keys(tests).slice(1).forEach(function(input) {
      var expected = '-' +tests[input];
      input = -input;
      it(format('should convert %s to %s', input, expected), function () {
        assert.equal(approximateNumber(input, options), expected);
      });
    });
  });
});
