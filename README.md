telltale
========
telltale is an unconventional option parser for Node.js.

telltale is unconventional in that it *only* parses long options, short options
and arguments. It does not know about switches, or any other variants of
argument parsing.

As a consequence, it's a lot easier to reason about how telltale will parse
an argument set.

Terminology
-----------
<dl>
	<dt>argument set</dt>
		<dd>An array consisting of both <a href="#options">options</a> and <a href="#arguments">arguments</a> to be parsed.</dd>
		<dd>Example: <code>['foo', '--bar', 'biz', '-f', 'b']</code>.
		</dd>

	<dt>option</dt>
		<dd>(1) Two adjacent elements of an <a href="#argument-set">argument set</a>: the first is the <a href="#option-key">option key</a>, and the second is the <a href="#option-value">option value</a>.</dd>
		<dd>Example: <code>[..., '--foo', 'bar', ...]</code>.
		</dd>
		<dd>(2) One element of an argument set: the <a href="#option-key">option key</a> and an <a href="#option-value">option value</a> separated by an <code>=</code>.</dd>
		<dd>Example: <code>[..., '-foo=bar', ...]</code>.
		</dd>

	<dt>option(al) key</dt>
		<dd>The first part of an <a href="#option">option</a>. An option key is a string literal prefixed by either a '-' or a '--'.</dd>
		<dd>Examples:
				<code>--foo</code>,
				<code>-bar</code>.
		</dd>

	<dt>option(al) value</dt>
		<dd>The second part of an <a href="#option">option</a>. An option value is any string literal.</dd>
		<dd>Examples:
				<code>biz</code>,
				<code>bar</code>,
				<code>f</code>,
				<code>--foo</code><a href="special case">*</a>.
		</dd>

	<dt>long option</dt>
		<dd>A long option is an <a href="#option">option</a> that has one of the two following forms:
		<ol>
				<li><code>--optionKey optionValue</code></li>
			<li><code>--optionKey=optionValue</code></li>
			</ol>
		</dd>
		<dd>Examples:
			<code>[..., '--foo', 'bar', ...]</code>,
			<code>[..., '--biz=baz', ...]</code>.
		</dd>

	<dt>short option</dt>
		<dd>A short option is an <a href="#option">option</a> that has one of the two following forms:
		<ol>
				<li><code>-optionKey optionValue</code></li>
			<li><code>-optionKey=optionValue</code></li>
			</ol>
		</dd>
		<dd>Examples:
			<code>[..., '--foo', 'bar', ...]</code>,
			<code>[..., '--biz=baz', ...]</code>.
		</dd>

	<dt>argument</dt>
		<dd>A standalone element in an <a href="#argument-set">argument set</a> that is not preceded by an <a href="#optional-key">optional key</a>. It's value is any string literal.</dd>
		<dd>Examples:
				<code>qux</code>,
				<code>nuz</code>,
				<code>diz</code>,
				<code>b</code>.
		</dd>
</dl>

Examples
--------
script.js:

	'use strict';
	var args = require('telltale')(process.argv);
	console.log(args);

### Example 1

	$ node script.js --foo bar arg1 -biz baz arg2 --buz=fuz arg3
	{ long: { foo: 'bar', buz: 'fuz' },
	  short: { biz: 'baz' },
	  args: [ 'arg1', 'arg2', 'arg3' ] }

Optional keys **MUST** be immediately followed by optional values. Not doing so
returns an unspecified result.

### Example 2

	$ node script.js --foo --bar --boo=--far -f -b buz
	{ long: { foo: '--bar', boo: '--far' },
	  short: { f: '-b' },
	  args: ['buz'] }

telltale is unconditional about argument parsing: an optional value always
immediately follows an optional key, no matter what the content of that optional
value is.

Think redis, where there's nothing special about the contents of a value.
Therefore, `--bar` or `-bar` are perfectly valid optional values.

### Example 3

	$ node script.js -foo -bar -boo=--far -f -b
	{ long: {},
	  short: { foo: '-bar', boo: '--far', f: '-b' },
	  args: [] }

### Example 4

	$ node script.js foo bar biz -- --foo --biz -buz=faz --fuz -b
	{ long: {},
	  short: {},
	  args: [ 'foo', 'bar', 'biz', '--foo', '--biz', '-buz=faz', '--fuz', '-b' ] }

If telltale encounters a bare `--` argument when parsing (and the prior element
in the argument set was not an option key), it treats the remaining elements in
the argument set as arguments unconditionally.

API
---

### telltale.parse(argumentSet)
Parses an [argument set](#argument-set) and returns an object that contains the
[long options](#long-options), the [short options](#short-options), and the
[argument](#argument)s.

Example:

	$ node
	> var telltale = require('telltale');
	> telltale.parse(['-foo', 'bar', 'arg1', '-biz', 'baz', 'arg2', '-b', '--v', '--buz=fuz', 'arg3']);
	{ long: { buz: 'fuz' },
	  short: { foo: 'bar', biz: 'baz', b: '--v' },
	  args: [ 'arg1', 'arg2', 'arg3' ] }

telltale's parser has four rules:

1. [Optional key](#option-al-key)s **MUST** be immediately followed by [optional value](#option-al-value)s. Not doing so returns an unspecified result.
1. An [optional value](#option-al-value) can be any string literal (including
literals that start with `-` or `--`), so long as it is immediately preceded by
an [optional key](#optional-key).
1. If telltale encounters a bare `--` [argument](#argument) when parsing (and the prior element in the [argument set](#argument-set) was not an [option key](#option-key)), it treats the remaining elements in the [argument set](#argument-set) as [argument](#argument)s unconditionally.
1. If two or more [optional key](#option-al-key)s with the same name are specified in the [argument set](#argument-set), only the lattermost [optional key](#option-al-key) and its corresponding [option value](#option-al-value) are in the returned object.

### telltale(argv)
A specialized version of <code><a href="#telltale-parse-argumentSet">telltale.parse</a></code> that ignores the first two [arguments](#arguments) from the [argument set](#argument-set) before parsing. This is useful when working directly with <code><a href="https://nodejs.org/api/process.html#process_process_argv">process.argv</a></code>.

Returns the same exact thing <code><a href="#telltale-parse-argumentSet">telltale.parse</a></code> does (omitting the first two [arguments](#arguments)).

Example:

script.js:

	'use strict';
	var args = require('telltale')(process.argv);
	console.log(args);

Command line:

	$ node script.js -foo bar arg1 -biz baz arg2 -b --v --buz=fuz arg3
	{ long: { buz: 'fuz' },
	  short: { foo: 'bar', biz: 'baz', b: '--v' },
	  args: [ 'arg1', 'arg2', 'arg3' ] }
