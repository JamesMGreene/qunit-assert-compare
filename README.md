# qunit-assert-compare
A QUnit plugin for asserting numerical comparisons like greater than, less than, etc.

[![Build Status](https://travis-ci.org/JamesMGreene/qunit-assert-canvas.png?branch=master)](https://travis-ci.org/JamesMGreene/qunit-assert-canvas) [![NPM version](https://badge.fury.io/js/qunit-assert-canvas.png)](https://www.npmjs.com/package/qunit-assert-canvas)

# QUnit numerical comparison assertion plugin

This plugin for [QUnit](https://github.com/jquery/qunit) adds a handful of custom assertion methods
to test for various numerical comparison situations:
 - `eq`: equal to
 - `neq`: not equal to
 - `lt`: less than
 - `lte`: less than or equal to
 - `gt`: greater than
 - `gte`: greater than or equal to
 - `compare`: sorting-style comparisons


## Usage

```js
assert.eq(num1, num2, message);
assert.neq(num1, num2, message);
assert.lt(num1, num2, message);
assert.lte(num1, num2, message);
assert.gt(num1, num2, message);
assert.gte(num1, num2, message);
assert.compare(num1, num2, expected, message);
```

Where:
 - `num1`: The lefthand operand
 - `num2`: The righthand operand
 - `message`: Optional message, same as for other assertions
 - `expected`: _[**ONLY** used for `assert.compare`!]_ A sorting-style return value for the numerical comparison:
      - `-1` (less than)
      - `0` (equal to)
      - `1` (greater than)


## Examples

```js
module('Example module')

test('Example unit test', function(assert) {
  assert.eq(2, 2);
  assert.neq(-2, 2);
  assert.lt(-2, 2);
  assert.lte(2, 2);
  assert.gt(2, -2);
  assert.gte(2, 2);

  assert.compare(-2, 2, -1);
});
```

For more examples, refer to the unit tests.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).


## License
Copyright (c) 2015 James M. Greene
Licensed under the MIT license.
