'use strict';

exports = module.exports = function(argv) {
	return exports.parse(argv.slice(2));
};

exports.parse = function parse(argv) {
	var args          = [];
	var long          = {};
	var short         = {};
	var prevWasOption = false;
	var option        = '';

	for (let i = 0, len = argv.length; i < len; i++) {
		let arg = argv[i];

		if (arg === '--') {
			args = args.concat(argv.slice(i + 1));
			break;
		}

		switch (prevWasOption) {
		case 'long':
			long[option]  = arg;
			prevWasOption = false;
			break;
		case 'short':
			short[option] = arg;
			prevWasOption = false;
			break;
		default:
			if (arg.startsWith('--')) {
				if (arg.indexOf('=') !== -1) {
					var parts = arg.split('=');
					long[parts[0].substring(2)] = parts[1];
				} else {
					option = arg.substring(2);
					prevWasOption = 'long';
				}
			} else if (arg.startsWith('-')) {
				if (arg.indexOf('=') !== -1) {
					var parts = arg.split('=');
					short[parts[0].substring(1)] = parts[1];
				} else {
					option = arg.substring(1);
					prevWasOption = 'short';
				}
			} else {
				args.push(arg);
			}
			break;
		}
	}

	return {long, short, args};
};
