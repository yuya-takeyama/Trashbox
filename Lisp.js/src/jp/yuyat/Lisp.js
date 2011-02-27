var jp = jp || {};
jp.yuyat = jp.yuyat || {};

jp.yuyat.Lisp = (function () {
  var Env, Lib, tokenize, read_from_tokens, parse, atom;

  Env = function (outer, vars, args) {
    var vars = vars || [];
    for (var i in vars) {
      this[vars[i]] = args[i];
    }
    this.__outer__ = outer;
  };

  Env.prototype = (function () {
    var __find__, __import__;

    __find__ = function (key) {
      if (key.match(/^__/)) {
        return null;
      }
      if (key in this) {
        return this;
      } else {
        return this.__outer__.__find__(key);
      }
    };

    __import__ = function (pkg) {
      for (var name in pkg) {
        this[name] = pkg[name];
      }
    };

    return {
      __find__ : __find__,
      __import__ : __import__
    };
  })();

  tokenize = function (s) {
    return s.replace(/(\(|\))/g, ' $1 ').replace(/^\s+|\s+$/g, '').split(/\s+/);
  };

  atom = function (token) {
    if (token.match(/^\d+$/)) {
      token = parseInt(token);
    } else if (token.match(/^\d+\.\d+$/)) {
      token = parseFloat(token);
    }
    return token;
  };

  read_from_tokens = function (tokens) {
    if (tokens.length === 0) {
      throw new Error('unexpected EOF while reading');
    }
    token = tokens.shift();
    if (token === '(') {
      var L = [];
      while (tokens[0] !== ')') {
        L.push(read_from_tokens(tokens));
      }
      tokens.shift();
      return L;
    } else if (token === ')') {
      throw new Error('unexpected )');
    } else {
      return atom(token);
    }
  };

  parse = function (s) {
    return read_from_tokens(tokenize(s));
  };

  eval = function (x, env) {
    if (typeof env === 'undefined') {
      env = this.global;
    }

    if (typeof x === 'string') {
      return env.__find__(x)[x];
    } else if (!(x instanceof Array)) {
      return x;
    } else if (x[0] === 'quote') {
      x.shift();
      return x;
    } else if (x[0] === 'if') {
      var test   = x[1],
          conseq = x[2],
          alt    = x[3];
      return eval(eval(test, env) ? conseq : alt, env);
    } else if (x[0] === 'define') {
      env[x[1]] = eval(x[2], env);
    } else if (x[0] === 'lambda') {
      var vars = x[1],
          exp  = x[2];
      var lambda =  function () {
        return eval(exp, new jp.yuyat.Lisp.Env(env, vars, arguments));
      };
      lambda.exp  = exp;
      lambda.args = vars;
      return lambda;
    } else if (x[0] === 'begin') {
      x.shift();
      for (var key in x) {
        var value = eval(x[key], env);
      }
      return value;
    } else {
      var exps = [];
      for (var i in x) {
        exps[i] = eval(x[i], env);
      }
      proc = exps.shift();
      return proc.apply(null, exps);
    }
  };

  Lib = {
    '+' : function () { return arguments[0] + arguments[1]; },
    '-' : function () { return arguments[0] - arguments[1]; },
    '*' : function () {
      var result = 1, i;
      for (i = 0; i < arguments.length; i++) {
        result *= arguments[i];
      }
      return result;
    },
    '/' : function () { return arguments[0] / arguments[1]; },
    '%' : function () { return arguments[0] % arguments[1]; },
    '>' : function () { return arguments[0] > arguments[1]; },
    '<' : function () { return arguments[0] < arguments[1]; },
    '>=' : function () { return arguments[0] >= arguments[1]; },
    '<=' : function () { return arguments[0] <= arguments[1]; },
    '=' : function () { return arguments[0] === arguments[1]; },
    'equal?' : function () { return arguments[0] === arguments[1]; },
    'length' : function () { return arguments[0].length; },
    'car' : function () { return arguments[0]; },
    'cdr' : function () { return Array.prototype.slice.apply(arguments, [1]); },
    'list' : function () { return Array.prototype.slice.apply(arguments, [0]); },
  };

  return {
    Env              : Env,
    Lib              : Lib,
    tokenize         : tokenize,
    read_from_tokens : read_from_tokens,
    parse            : parse,
    atom             : atom,
    eval             : eval
  };
})();

jp.yuyat.Lisp.global = new jp.yuyat.Lisp.Env;
jp.yuyat.Lisp.global.__import__(jp.yuyat.Lisp.Lib);
