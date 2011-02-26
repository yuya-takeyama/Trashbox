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

testcase.test('Lisp.Env.find', function (a) {
  var outer_env = new Lisp.Env;
  var inner_env = new Lisp.Env(outer_env);
  outer_env['foo'] = 'bar';

  a.equals(outer_env, inner_env.find('foo'));
  a.equals('bar',     inner_env.find('foo')['foo']);
});

testcase.test('Lisp.Env.find should returns null if the key starts with "__".', function (a) {
  var env = new Lisp.Env;

  a.is_null(env.find('__outer__'));
});

testcase.test('Lisp.eval define', function (a) {
  var env = new Lisp.Env;
  Lisp.eval(['define', 'foo', 42], env);

  a.equals(42, env['foo']);
});

testcase.test('Lisp.eval begin', function (a) {
  var env = new Lisp.Env;
  Lisp.eval(['begin', ['define', 'foo', 66], ['define', 'hoge', 72]], env);

  a.equals(66, env['foo']);
  a.equals(72, env['hoge']);
});

var result = testcase.run();
result.display();
