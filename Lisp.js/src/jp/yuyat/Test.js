var jp = jp || {};

jp.yuyat = jp.yuyat || {};
jp.yuyat.Test = {};
jp.yuyat.Test.Unit = {};

jp.yuyat.Test.Unit.TestCase = function () {
  this.tests = [];
};

jp.yuyat.Test.Unit.Result = function (params) {
  this.tests_count      = params.tests_count;
  this.assertions_count = params.assertions_count;
};

jp.yuyat.Test.Unit.Result.prototype = (function () {
  var display;

  display = function () {
    print(this.tests_count + ' tests. ' + this.assertions_count + ' assertions.');
  };

  return {
    display : display
  };
})();

jp.yuyat.Test.Unit.Assertion = function () {
  this.assertions_count = 0;
  this.failures_count   = 0;
};

jp.yuyat.Test.Unit.Assertion.prototype = (function () {
  var equals, _equals, length, is_null, count_up;

  _equals = function (expected, actual) {
    if (expected instanceof Array) {
      for (var key in expected) {
        _equals(expected[key], actual[key]);
      }
    } else {
      if (expected !== actual) {
        throw new Error;
      }
    }
  };

  equals = function (expected, actual) {
    this.assertions_count++;
    _equals(expected, actual);
  };

  length = function (expected, subject) {
    this.assertions_count++;
    if (expected !== subject.length) {
      throw new Error;
    }
  };

  is_null = function (subject) {
    this.assertions_count++;
    if (subject !== null) {
      throw new Error;
    }
  };

  return {
    equals  : equals,
    length  : length,
    is_null : is_null
  };
})();

jp.yuyat.Test.Unit.TestCase.prototype = (function () {
  var test, run;
  
  test = function (comment, callback) {
    this.tests.push({
      comment : comment,
      test    : callback
    });
  };

  run = function () {
    var assertion = new jp.yuyat.Test.Unit.Assertion;
    for (var key in this.tests) {
      var test      = this.tests[key];
      try {
        test.test(assertion);
        print('OK... ' + test.comment);
      } catch (e) {
        print('Error: ' + e.name + ': ' + e.message);
        print('NG... ' + test.comment);
      }
    }
    return new jp.yuyat.Test.Unit.Result({
      tests_count      : this.tests.length,
      assertions_count : assertion.assertions_count
    });
  };

  return {
    test : test,
    run  : run
  };
})();
