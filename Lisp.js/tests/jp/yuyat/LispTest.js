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

testcase.test('(define var exp)', function (a) {
  var env = new Lisp.Env;
  Lisp.eval(Lisp.parse('(define foo bar)'), env);

  a.equals('bar', env['foo']);
});

testcase.run();
