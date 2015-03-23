(function(module, test) {

  var _tmpPushFailure;

  module(
    "qunit-assert-compare plugin unit tests - Negative test cases",
    {
      beforeEach: function() {
        var context = this;
        context.pushFailureCount = 0;

        _tmpPushFailure = QUnit.pushFailure;
        QUnit.pushFailure = function() {
          // Expect failing/negative assertion results
          context.pushFailureCount++;
        };
      },

      afterEach: function() {
        var context = this;
        context.pushFailureCount = 0;
        delete context.pushFailureCount;

        QUnit.pushFailure = _tmpPushFailure;
      }
    }
  );


  test("All assertion methods fail on non-number inputs", function(assert) {
    var badInputs = [NaN, true, false, "", "4", "hi", new Date(), [], {}, function() {}, null, undefined];
    var goodInputs = [0, 3, Infinity, -Infinity];
    var index1, index2, len1, len2;
    var expectedFailureCount = 0;
    var methodsUnderTestCount = 7;

    assert.expect(4);

    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);

    // Bad-bad inputs
    for (index1 = 0, len1 = badInputs.length; index1 < len1; index1++) {
      for (index2 = 0, len2 = badInputs.length; index2 < len2; index2++) {
        assert.compare(badInputs[index1], badInputs[index2], 0, "`assert.compare` fails on non-number inputs (bad-bad)");
        assert.eq(badInputs[index1], badInputs[index2], "`assert.eq` fails on non-number inputs (bad-bad)");
        assert.neq(badInputs[index1], badInputs[index2], "`assert.neq` fails on non-number inputs (bad-bad)");
        assert.lt(badInputs[index1], badInputs[index2], "`assert.lt` fails on non-number inputs (bad-bad)");
        assert.lte(badInputs[index1], badInputs[index2], "`assert.lte` fails on non-number inputs (bad-bad)");
        assert.gt(badInputs[index1], badInputs[index2], "`assert.gt` fails on non-number inputs (bad-bad)");
        assert.gte(badInputs[index1], badInputs[index2], "`assert.gte` fails on non-number inputs (bad-bad)");
      }
    }

    expectedFailureCount += methodsUnderTestCount * len1 * len2;
    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);

    // Good-bad inputs
    for (index1 = 0, len1 = goodInputs.length; index1 < len1; index1++) {
      for (index2 = 0, len2 = badInputs.length; index2 < len2; index2++) {
        assert.compare(goodInputs[index1], badInputs[index2], 0, "`assert.compare` fails on non-number inputs (good-bad)");
        assert.eq(goodInputs[index1], badInputs[index2], "`assert.eq` fails on non-number inputs (good-bad)");
        assert.neq(goodInputs[index1], badInputs[index2], "`assert.neq` fails on non-number inputs (good-bad)");
        assert.lt(goodInputs[index1], badInputs[index2], "`assert.lt` fails on non-number inputs (good-bad)");
        assert.lte(goodInputs[index1], badInputs[index2], "`assert.lte` fails on non-number inputs (good-bad)");
        assert.gt(goodInputs[index1], badInputs[index2], "`assert.gt` fails on non-number inputs (good-bad)");
        assert.gte(goodInputs[index1], badInputs[index2], "`assert.gte` fails on non-number inputs (good-bad)");
      }
    }

    expectedFailureCount += methodsUnderTestCount * len1 * len2;
    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);

    // Bad-good inputs
    for (index1 = 0, len1 = badInputs.length; index1 < len1; index1++) {
      for (index2 = 0, len2 = goodInputs.length; index2 < len2; index2++) {
        assert.compare(badInputs[index1], goodInputs[index2], 0, "`assert.compare` fails on non-number inputs (bad-good)");
        assert.eq(badInputs[index1], goodInputs[index2], "`assert.eq` fails on non-number inputs (bad-good)");
        assert.neq(badInputs[index1], goodInputs[index2], "`assert.neq` fails on non-number inputs (bad-good)");
        assert.lt(badInputs[index1], goodInputs[index2], "`assert.lt` fails on non-number inputs (bad-good)");
        assert.lte(badInputs[index1], goodInputs[index2], "`assert.lte` fails on non-number inputs (bad-good)");
        assert.gt(badInputs[index1], goodInputs[index2], "`assert.gt` fails on non-number inputs (bad-good)");
        assert.gte(badInputs[index1], goodInputs[index2], "`assert.gte` fails on non-number inputs (bad-good)");
      }
    }

    expectedFailureCount += methodsUnderTestCount * len1 * len2;
    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);
  });


  test("`compare` fails on non-number `expected` param", function(assert) {
    var badExpecteds = [NaN, true, false, "", "4", "hi", new Date(), [], {}, function() {}, null, undefined];
    var expectedFailureCount = 0;

    assert.expect(2);

    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);

    for (var i = 0, len = badExpecteds.length; i < len; i++) {
      assert.compare(1, 1, badExpecteds[i], "`assert.compare` fails on non-number `expected` param: " + (badExpecteds[i] !== badExpecteds[i] ? "NaN" : JSON.stringify(badExpecteds[i])));
    }

    expectedFailureCount += len;
    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);
  });


  test("`compare` fails on out-of-range `expected` param", function(assert) {
    var badExpecteds = [-0.9, 0.9, -1.1, 1.1, -2, 2, Infinity, -Infinity];
    var expectedFailureCount = 0;

    assert.expect(2);

    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);

    for (var i = 0, len = badExpecteds.length; i < len; i++) {
      assert.compare(1, 1, badExpecteds[i], "`assert.compare` fails on out-of-range `expected` param: " + badExpecteds[i]);
    }

    expectedFailureCount += len;
    assert.strictEqual(this.pushFailureCount, expectedFailureCount, "Internal failure counter should be " + expectedFailureCount);
  });


  module("qunit-assert-compare plugin unit tests - Positive test cases");

  test("`assert.compare` works", function(assert) {
    assert.expect(16);

    // eq
    assert.compare(-2, -2, 0);
    assert.compare(0, 0, 0);
    assert.compare(0.5, 0.5, 0);
    assert.compare(2, 2, 0);

    // lt
    assert.compare(-2, 0, -1);
    assert.compare(-2, 0.5, -1);
    assert.compare(-2, 2, -1);
    assert.compare(0, 0.5, -1);
    assert.compare(0, 2, -1);
    assert.compare(0.5, 2, -1);

    // gt
    assert.compare(0, -2, 1);
    assert.compare(0.5, -2, 1);
    assert.compare(2, -2, 1);
    assert.compare(0.5, 0, 1);
    assert.compare(2, 0, 1);
    assert.compare(2, 0.5, 1);
  });


  test("`assert.eq` works", function(assert) {
    assert.expect(4);

    // eq
    assert.eq(-2, -2);
    assert.eq(0, 0);
    assert.eq(0.5, 0.5);
    assert.eq(2, 2);
  });


  test("`assert.neq` works", function(assert) {
    assert.expect(12);

    // lt
    assert.neq(-2, 0);
    assert.neq(-2, 0.5);
    assert.neq(-2, 2);
    assert.neq(0, 0.5);
    assert.neq(0, 2);
    assert.neq(0.5, 2);

    // gt
    assert.neq(0, -2);
    assert.neq(0.5, -2);
    assert.neq(2, -2);
    assert.neq(0.5, 0);
    assert.neq(2, 0);
    assert.neq(2, 0.5);
  });


  test("`assert.lt` works", function(assert) {
    assert.expect(6);

    // lt
    assert.lt(-2, 0);
    assert.lt(-2, 0.5);
    assert.lt(-2, 2);
    assert.lt(0, 0.5);
    assert.lt(0, 2);
    assert.lt(0.5, 2);
  });


  test("`assert.lte` works", function(assert) {
    assert.expect(10);

    // eq
    assert.lte(-2, -2);
    assert.lte(0, 0);
    assert.lte(0.5, 0.5);
    assert.lte(2, 2);

    // lt
    assert.lte(-2, 0);
    assert.lte(-2, 0.5);
    assert.lte(-2, 2);
    assert.lte(0, 0.5);
    assert.lte(0, 2);
    assert.lte(0.5, 2);
  });


  test("`assert.gt` works", function(assert) {
    assert.expect(6);

    // gt
    assert.gt(0, -2);
    assert.gt(0.5, -2);
    assert.gt(2, -2);
    assert.gt(0.5, 0);
    assert.gt(2, 0);
    assert.gt(2, 0.5);
  });


  test("`assert.gte` works", function(assert) {
    assert.expect(10);

    // eq
    assert.gte(-2, -2);
    assert.gte(0, 0);
    assert.gte(0.5, 0.5);
    assert.gte(2, 2);

    // gt
    assert.gte(0, -2);
    assert.gte(0.5, -2);
    assert.gte(2, -2);
    assert.gte(0.5, 0);
    assert.gte(2, 0);
    assert.gte(2, 0.5);
  });


})(QUnit.module, QUnit.test);
