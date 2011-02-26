load('../../../src/jp/yuyat/Test.js');
load('../../../src/jp/yuyat/Lisp.js');

var Lisp = jp.yuyat.Lisp;
var testcase = new jp.yuyat.Test.Unit.TestCase;

testcase.test('Lisp.tokenize', function (a) {
  var tokens = Lisp.tokenize('(define foo (* 1 2.3))');

  a.equals(
    ['(', 'define', 'foo', '(', '*', '1', '2.3', ')', ')'],
    tokens
  );
});

testcase.test('Lisp.parse', function (a) {
  var parsed = Lisp.parse('(begin (define r 3) (* 3.141592653 (* r r)))');

  a.equals(
    ['begin', ['define', 'r', 3], ['*', 3.141592653, ['*', 'r', 'r']]],
    parsed
  );
});

testcase.test('Lisp.Env', function (a) {
  var env = new Lisp.Env;
  env['name'] = 'Yuya Takeyama';
  env['age']  = 23;

  a.equals('Yuya Takeyama', env['name']);
  a.equals(23,              env['age']);
});

testcase.test('Lisp.Env.__find__', function (a) {
  var outer_env = new Lisp.Env;
  var inner_env = new Lisp.Env(outer_env);
  outer_env['foo'] = 'bar';

  a.equals(outer_env, inner_env.__find__('foo'));
  a.equals('bar',     inner_env.__find__('foo')['foo']);
});

testcase.test('Lisp.Env.__find__ should returns null if the key starts with "__".', function (a) {
  var env = new Lisp.Env;

  a.is_null(env.__find__('__outer__'));
});

testcase.test('Lisp.eval define', function (a) {
  var env = new Lisp.Env;
  Lisp.eval(['define', 'foo', 42], env);

  a.equals(42, env['foo']);
});

testcase.test('Lisp.eval begin', function (a) {
  var env = new Lisp.Env;
  env['*'] = function () { return arguments[0] * arguments[1]; };
  var result = Lisp.eval(['begin', ['define', 'foo', 3], ['define', 'hoge', 9], ['*', 'foo', 'hoge']], env);

  a.equals(3,  env['foo']);
  a.equals(9,  env['hoge']);
  a.equals(27, result);
});

testcase.test('lambda execution', function (a) {
  var env = new Lisp.Env;
  env['+'] = function () { return arguments[0] + arguments[1]; };

  a.equals(3, Lisp.eval(['+', 1, 2], env));
});

testcase.test('nested lambda execution', function (a) {
  var env = new Lisp.Env;
  env['+'] = function () { return arguments[0] + arguments[1]; };

  a.equals(6, Lisp.eval(['+', 1, ['+', 2, 3]], env));
});

testcase.test('Lisp.eval if list', function (a) {
  var env = new Lisp.Env;
  a.equals(2, Lisp.eval(['if', 1, 2, 3], env));
  a.equals(3, Lisp.eval(['if', 0, 2, 3], env));
});

testcase.test('Lisp.eval quote', function (a) {
  var env = new Lisp.Env;
  var result = Lisp.eval(['quote', 2, 3, 5, 7, 11], env);

  a.equals([2, 3, 5, 7, 11], result);
});

testcase.test('Lisp.Env.__import__', function (a) {
  var env = new Lisp.Env;
  env.__import__(Lisp.Lib);

  a.equals(-6, Lisp.eval(['+', 1, ['-', 9, ['*', 2, 8]]], env));
})

testcase.test('Lisp.eval lambda', function (a) {
  Lisp.eval(Lisp.parse('(define mul (lambda (a b) (* a b)))'));

  a.equals(12, Lisp.eval(['mul', 3, 4]));
});

testcase.test('Lisp.eval car', function (a) {
  a.equals(1, Lisp.eval(Lisp.parse('(car 1 3 5 7 9)')));
});

testcase.test('Lisp.eval cdr', function (a) {
  a.equals([3, 5, 7, 9], Lisp.eval(Lisp.parse('(cdr 1 3 5 7 9)')));
});

testcase.test('Lisp.eval list', function (a) {
  a.equals([1, 3, 5, 7, 9], Lisp.eval(Lisp.parse('(list 1 3 5 7 9)')));
});

var result = testcase.run();
result.display();
