(function(factory) {

  // NOTE:
  // All techniques except for the "browser globals" fallback will extend the
  // provided QUnit object but return the isolated API methods

  // For AMD: Register as an anonymous AMD module with a named dependency on "qunit".
  if (typeof define === "function" && define.amd) {
    define(["qunit"], factory);
  }
  // For Node.js
  else if (typeof module !== "undefined" && module && module.exports && typeof require === "function") {
    module.exports = factory(require("qunitjs"));
  }
  // For CommonJS with `exports`, but without `module.exports`, like Rhino
  else if (typeof exports !== "undefined" && exports && typeof require === "function") {
    var qunit = require("qunitjs");
    qunit.extend(exports, factory(qunit));
  }
  // For browser globals
  else {
    factory(QUnit);
  }

}(function(QUnit) {

  function _validateNumber(num) {
    return (typeof num === "number" || num instanceof Number) && !isNaN(Number(num));
  }

  function _validateAndClean(input) {
    var num1 = input.operand1,
        num2 = input.operand2,
        expected = input.expected;

    if (!(_validateNumber(num1) && _validateNumber(num2) && _validateNumber(expected))) {
      QUnit.pushFailure("Arguments `num1`, `num2`, and `expected` must all be valid numbers: " + JSON.stringify(num1) + ", " + JSON.stringify(num2) + ", " + JSON.stringify(expected));
    }
    else if (!(expected === -1 || expected === 0 || expected === 1)) {
      QUnit.pushFailure("Argument `expected` was " + JSON.stringify(expected) + " must be one of the following numbers: -1, 0, 1");
    }
    else {
      return {
        operand1: Number(num1),
        operand2: Number(num2),
        expected: Number(expected),
        message: input.message
      };
    }
  }

  function _getMessageText(num1, num2, expected) {
    var shouldBe = {
          eq: expected.length === 1 && expected[0] === 0,
          neq: expected.length === 2 && expected[0] === -1 && expected[1] === 1,
          lt: expected.length === 1 && expected[0] === -1,
          lte: expected.length === 2 && expected[0] === -1 && expected[1] === 0,
          gt: expected.length === 1 && expected[0] === 1,
          gte: expected.length === 2 && expected[0] === 0 && expected[1] === 1
        };

    var isNegated = shouldBe.neq;
    var comparisonText = (
      ((shouldBe.eq || shouldBe.neq) && "equal to") ||
      (shouldBe.lt && "less than") ||
      (shouldBe.lte && "less than or equal to") ||
      (shouldBe.gt && "greater than") ||
      (shouldBe.gte && "greater than or equal to")
    );

    var message = "" + num1 + " should " + (isNegated ? "not " : "") + "be " + comparisonText + " " + num2;
    return message;
  }

  function _getResult(expected, actual) {
    var result = false;
    if (expected.length === 1) {
      result = actual === expected[0];
    }
    else if (expected.length === 2) {
      result = actual === expected[0] || actual === expected[1];
    }
    return result;
  }

  function _compare(input) {
    var num1 = input.operand1,
        num2 = input.operand2,
        expected = input.expected,
        message = input.message || _getMessageText(num1, num2, expected),
        actual = num1 === num2 ? 0 : num1 < num2 ? -1 : num1 > num2 ? 1 : undefined;

    return {
      operand1: num1,
      operand2: num2,
      expected: expected,
      message: message,
      actual: actual,
      result: _getResult(expected, actual)
    };
  }


  /**
   * Find an appropriate `Assert` context to `push` results to.
   * @param * context - An unknown context, possibly `Assert`, `Test`, or neither
   * @private
   */
  function _getPushContext(context) {
    var pushContext;

    if (context && typeof context.push === "function") {
      // `context` is an `Assert` context
      pushContext = context;
    }
    else if (context && context.assert && typeof context.assert.push === "function") {
      // `context` is a `Test` context
      pushContext = context.assert;
    }
    else if (
      QUnit && QUnit.config && QUnit.config.current && QUnit.config.current.assert &&
      typeof QUnit.config.current.assert.push === "function"
    ) {
      // `context` is an unknown context but we can find the `Assert` context via QUnit
      pushContext = QUnit.config.current.assert;
    }
    else if (QUnit && typeof QUnit.push === "function") {
      pushContext = QUnit.push;
    }
    else {
      throw new Error("Could not find the QUnit `Assert` context to push results");
    }

    return pushContext;
  }


  var api = {

    /**
     * Compare two numbers numerically.
     * Rules:
     *   - If num1 is equal to num2, return 0;
     *   - If num1 is less than num2, return -1;
     *   - If num1 is greater than num2, return 1
     *
     * @example assert.compare(3, 4, -1, "3 is less than 4");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param Number expected  The expected comparison result
     * @param String message (optional)
     */
    compare: function compare(num1, num2, expected, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: expected,
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [cleanedInput.expected];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    },

    /**
     * Is `num1` equal to `num2`?
     *
     * @example assert.eq(0.5, 1/2, "0.5 is equal to 1/2");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param String message (optional)
     */
    eq: function eq(num1, num2, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: 0,
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [0];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    },

    /**
     * Is `num1` not equal to `num2`?
     *
     * @example assert.neq(0.5, 5.0, "0.5 is not equal to 5.0");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param String message (optional)
     */
    neq: function neq(num1, num2, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: 0,      // This is very wrong but... internal usage, so meh!
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [-1, 1];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    },

    /**
     * Is `num1` less than `num2`?
     *
     * @example assert.lt(1, 2, "1 is less than 2");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param String message (optional)
     */
    lt: function lt(num1, num2, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: -1,
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [-1];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    },

    /**
     * Is `num1` less than or equal to `num2`?
     *
     * @example assert.lte(1, 2, "1 is less than or equal to 2");
     * @example assert.lte(2, 2, "2 is less than or equal to 2");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param String message (optional)
     */
    lte: function lte(num1, num2, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: -1,     // Untrue but... internal usage, so meh!
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [-1, 0];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    },

    /**
     * Is `num1` greater than `num2`?
     *
     * @example assert.gt(2, 1, "2 is greater than 1");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param String message (optional)
     */
    gt: function gt(num1, num2, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: 1,
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [1];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    },

    /**
     * Is `num1` greater than or equal to `num2`?
     *
     * @example assert.gte(2, 2, "2 is greater than or equal to 2");
     * @example assert.gte(2, 1, "2 is greater than or equal to 1");
     *
     * @param Number num1   The actual left operand
     * @param Number num2   The actual right operand
     * @param String message (optional)
     */
    gte: function gte(num1, num2, message) {
      var output,
          input = {
            operand1: num1,
            operand2: num2,
            expected: 1,      // Untrue but... internal usage, so meh!
            message: message
          },
          cleanedInput = _validateAndClean(input),
          pushContext = _getPushContext(this);

      if (cleanedInput) {
        // Array-ify
        cleanedInput.expected = [0, 1];

        output = _compare(cleanedInput);
        pushContext.push(output.result, output.actual, output.expected, output.message);
      }
    }

  };


  QUnit.extend(QUnit.assert, api);

  return api;
}));
