'use strict';
const {benchmark} = require('../benchmark-utils.js');
const assert = require('assert');

describe('The Benchmark', function() {
	
	it('should return an object with values', function() {

		const f = function (a,b) {return a+b};
		const args = [1, 2];
		const trials = 1;
		
		const result = benchmark(f, args, trials);

		assert.equal(result.res, 3);
		assert.equal(true, Number.isInteger(result.mean));
		assert.equal(true, Number.isInteger(result.times[0]));
		assert.equal('uS', result.unit);
	})
})