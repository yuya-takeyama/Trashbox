var jp = jp || {};

jp.yuyat = jp.yuyat || {};
jp.yuyat.Test = {};
jp.yuyat.Test.Unit = {};

jp.yuyat.Test.Unit.TestCase = function () {
  this.tests = [];
};

jp.yuyat.Test.Unit.Result = function (params) {
  this.tests_count = params.tests_count;
};

jp.yuyat.Test.Unit.Result.prototype = (function () {
  var display;

  display = function () {
    print(this.tests_count + ' tests.');
  };

  return {
    display : display
  };
})();

jp.yuyat.Test.Unit.Assersions = (function () {
  var equals, length, is_null;

  equals = function (expected, actual) {
    if (expected instanceof Array) {
      for (var key in expected) {
        equals(expected[key], actual[key]);
      }
    } else {
      if (expected !== actual) {
        throw new Error;
      }
    }
  };

  length = function (expected, subject) {
    if (expected !== subject.length) {
      throw new Error;
    }
  };

  is_null = function (subject) {
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
    for (var key in this.tests) {
      var test = this.tests[key];
      try {
        test.test(jp.yuyat.Test.Unit.Assersions);
        print('OK... ' + test.comment);
      } catch (e) {
        print('NG... ' + test.comment);
      }
    }
    return new jp.yuyat.Test.Unit.Result({
      tests_count : this.tests.length
    });
  };

  return {
    test : test,
    run  : run
  };
})();
