'use strict';

var assert = require('assert');

var telltale = require('../lib/index.js');

function no_options_or_args() {
	var expectedResult = {
		long: {},
		short: {},
		args: []
	};
	var testData = [];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function args_only() {
	var expectedResult = {
		long: {},
		short: {},
		args: ['foo', 'bar', 'biz']
	};
	var testData = ['foo', 'bar', 'biz'];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function extra_args() {
	var expectedResult = {
		long: {},
		short: {},
		args: [
			'foo',
			'bar',
			'biz',
			'--foo',
			'-bar',
			'--foo=bar',
			'-foo=bar'
		]
	};
	var testData = [
		'foo',
		'bar',
		'biz',
		'--',
		'--foo',
		'-bar',
		'--foo=bar',
		'-foo=bar'
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function long_options_only() {
	var expectedResult = {
		long: {
			'foo': 'bar',
			'biz': 'baz',
			'f': 'buz',
		},
		short: {},
		args: []
	};
	var testData = [
		'--foo', 'bar',
		'--biz=baz',
		'--f', 'buz'
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function long_options_overwrite() {
	var expectedResult = {
		long: {
			'foo': 'secondValue'
		},
		short: {},
		args: []
	};
	var testData = [
		'--foo', 'bar',
		'--foo', 'secondValue',
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function long_options_options() {
	var expectedResult = {
		long: {
			'foo': '--bar',
			'biz': '--baz',
			'f': '--buz',
			'boo': '-far',
			'fiz': '-faz',
			'b': '-fuz',
		},
		short: {},
		args: []
	};
	var testData = [
		'--foo', '--bar',
		'--biz=--baz',
		'--f', '--buz',
		'--boo', '-far',
		'--fiz=-faz',
		'--b', '-fuz'
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function short_options_only() {
	var expectedResult = {
		long: {},
		short: {
			'boo': 'far',
			'fiz': 'faz',
			'b': 'fuz',
		},
		args: []
	};
	var testData = [
		'-boo', 'far',
		'-fiz=faz',
		'-b', 'fuz'
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function short_options_overwrite() {
	var expectedResult = {
		long: {
			'boo': 'secondValue'
		},
		short: {},
		args: []
	};
	var testData = [
		'--boo', 'far',
		'--boo', 'secondValue',
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function short_options_options() {
	var expectedResult = {
		long: {},
		short: {
			'boo': '-far',
			'fiz': '-faz',
			'b': '-fuz',
			'foo': '--bar',
			'biz': '--baz',
			'f': '--buz',
		},
		args: []
	};
	var testData = [
		'-boo', '-far',
		 '-fiz=-faz',
		 '-b', '-fuz',
		 '-foo', '--bar',
		 '-biz=--baz',
		 '-f', '--buz'
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function args_with_short_and_long_options() {
	var expectedResult = {
		long: {
			'foo': 'bar',
			'biz': 'baz',
			'f': 'buz',
		},
		short: {
			'boo': 'far',
			'fiz': 'faz',
			'b': 'fuz',
		},
		args: ['foo', 'bar', 'biz']
	};
	var testData = [
		'--foo', 'bar',
		'-boo', 'far',
		'-fiz=faz',
		'foo', 	
		'--biz=baz',
		'bar', 	
		'--f', 'buz',
		'-b', 'fuz',
		'biz'
	];

	var testResult = telltale.parse(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

function call_module_exports_as_function() {
	var expectedResult = {
		long: {
			'foo': 'bar',
			'biz': 'baz',
			'f': 'buz',
		},
		short: {
			'boo': 'far',
			'fiz': 'faz',
			'b': 'fuz',
		},
		args: ['foo', 'bar', 'biz']
	};
	var testData = [
		'node', './script.js',
		'--foo', 'bar',
		'-boo', 'far',
		'-fiz=faz',
		'foo', 	
		'--biz=baz',
		'bar', 	
		'--f', 'buz',
		'-b', 'fuz',
		'biz'
	];

	var testResult = telltale(testData);

	assert.deepStrictEqual(expectedResult, testResult);
}

no_options_or_args();
args_only();
extra_args();
long_options_only();
long_options_overwrite();
long_options_options();
short_options_only();
short_options_overwrite();
short_options_options();
args_with_short_and_long_options();
call_module_exports_as_function();

console.log('All tests passed!');
