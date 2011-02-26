var jp = jp || {};
jp.yuyat = jp.yuyat || {};

jp.yuyat.Lisp = (function () {
  var Env, tokenize, read_from_tokens, parse, atom;

  Env = function (outer, vars, args) {
    for (var key in vars) {
      this[key] = vars[key];
    }
    this.__args__  = args || [];
    this.__outer__ = outer;
  };

  Env.prototype = (function () {
    var find;

    find = function (key) {
      if (key.match(/^__/)) {
        return null;
      }
      if (key in this) {
        return this;
      } else {
        return this.__outer__.find(key);
      }
    };

    return {
      find : find
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
      env = global;
    }

    if (typeof x === 'string') {
      return env.find(x)[x];
    } else if (!(x instanceof Array)) {
      return x;
    } else if (x[0] === 'define') {
      env[x[1]] = eval(x[2], env);
    } else if (x[0] === 'lambda') {
      return function () {
        eval(x[2], new Lisp.Env(x[1], arguments, env));
      };
    } else if (x[0] === 'begin') {
      x.shift();
      for (var key in x) {
        var value = eval(x[key], env);
      }
      return value;
    }
  }

  return {
    Env              : Env,
    global           : new Env,
    tokenize         : tokenize,
    read_from_tokens : read_from_tokens,
    parse            : parse,
    atom             : atom,
    eval             : eval
  };
})();
