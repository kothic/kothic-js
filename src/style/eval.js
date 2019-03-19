'use strict';

const EVAL_FUNCTIONS = {
  min: function (/*...*/) {
    return Math.min.apply(null, arguments);
  },

  max: function (/*...*/) {
    return Math.max.apply(null, arguments);
  },

  any: function (/*...*/) {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof(arguments[i]) !== 'undefined' && arguments[i] !== '') {
        return arguments[i];
      }
    }

    return '';
  },

  num: function (arg) {
    const n = parseFloat(arg);
    return isNaN(n) ? 0 : n;
  },

  str: function (arg) {
    return '' + arg;
  },

  int: function (arg) {
    const n = parseInt(arg, 10);
    return isNaN(n) ? 0 : n;
  },

  sqrt: function (arg) {
    return Math.sqrt(arg);
  },

  cond: function (arg, trueExpr, falseExpr) {
    trueExpr = trueExpr || true;
    falseExpr = falseExpr || false;

    return arg ? trueExpr : falseExpr;
  },

  metric: function (arg) {
    if (/\d\s*mm$/.test(arg)) {
      return 0.001 * parseFloat(arg);
    } else if (/\d\s*cm$/.test(arg)) {
      return 0.01 * parseFloat(arg);
    } else if (/\d\s*dm$/.test(arg)) {
      return 0.1 * parseFloat(arg);
    } else if (/\d\s*km$/.test(arg)) {
      return 1000 * parseFloat(arg);
    } else if (/\d\s*(in|")$/.test(arg)) {
      return 0.0254 * parseFloat(arg);
    } else if (/\d\s*(ft|')$/.test(arg)) {
      return 0.3048 * parseFloat(arg);
    } else {
      return parseFloat(arg);
    }
  },

  join: function () {
    if (arguments.length === 2 && Object.prototype.toString.call(arguments[1]) === '[object Array]') {
      return arguments[1].join(arguments[0]);
    }
    var tagString = "";

    for (var i = 1; i < arguments.length; i++) {
      tagString = tagString.concat(arguments[0]).concat(arguments[i]);
    }

    return tagString.substr(arguments[0].length);
  },

  split: function (sep, text) {
    return text.split(sep);
  },

  get: function(arr, index) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return "";
    }

    if (!/^[0-9]+$/.test(index) || index >= arr.length) {
      return "";
    }

    return arr[index];
  },

  set: function(arr, index, text) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return arr;
    }

    if (!/^[0-9]+$/.test(index)) {
      return arr;
    }

    arr[index] = text;

    return arr;
  },

  count: function(arr) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return 0;
    }

    return arr.length;
  },

  list: function() {
    return Array.from(arguments);
  },

  append: function(lst, v) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return [];
    }

    lst.push(v);

    return lst;
  },

  contains: function(lst, v) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return false;
    }

    return (lst.indexOf(v) >= 0);
  },

  sort: function(lst) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return [];
    }

    lst.sort();

    return lst;
  },

  reverse: function(lst) {
    if (Object.prototype.toString.call(lst) !== '[object Array]') {
      return [];
    }

    return lst.reverse();
  },
};

function evalBinaryOp(left, op, right) {
  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    default:
      throw new TypeError("Unexpected binary opertator in eval " + JSON.stringify(op));
  }
}

function evalFunc(func, args, tags, actions, locales) {
  switch (func) {
    case 'tag':
      if (args.length != 1) {
        throw new Error("tag() function allows only one argument");
      }
      return args[0] in tags ? tags[args[0]] : '';
    case 'prop':
      if (args.length != 1) {
        throw new Error("prop() function allows only one argument");
      }
      return args[0] in actions ? actions[args[0]] : '';
    case 'localize':
      if (args.length != 1) {
        throw new Error("localize() function allows only one argument");
      }
      const field = args[0];
      for (var i = 0; i < locales.length; i++) {
        const tag = field + ':' + locales[i];
        if (tag in tags) {
          return tags[tag];
        }
      }

      return field in tags ? tags[field] : '';
    default:
      if (!(func in EVAL_FUNCTIONS)) {
        throw new Error("Unexpected function in eval " + JSON.stringify(func));
      }
      return EVAL_FUNCTIONS[func].apply(this, args);
  }
}

function evalExpr(expr, tags={}, actions={}, locales=[]) {
  switch (expr.type) {
    case "binary_op":
      return evalBinaryOp(evalExpr(expr.left, tags, actions, locales), expr.op, evalExpr(expr.right, tags, actions, locales));
    case "function":
      return evalFunc(expr.func, expr.args.map((x) => evalExpr(x, tags, actions)), tags, actions, locales);
    case "string":
    case "number":
      return expr.value;
    default:
      throw new TypeError("Unexpected expression type " + JSON.stringify(expr));
  }
}

function appendKnownTags(tags, expr, locales) {
  switch (expr.type) {
    case "binary_op":
      appendKnownTags(tags, expr.left);
      appendKnownTags(tags, expr.right);
      break;
    case "function":
      if (expr.func === "tag") {
        if (expr.args && expr.args.length == 1) {
          const tag = evalExpr(expr.args[0], {}, {});
          tags[tag] = 'kv';
        }
      } else if (expr.func === "localize") {
        if (expr.args && expr.args.length == 1) {
          const tag = evalExpr(expr.args[0], {}, {});
          tags[tag] = 'kv';
          locales.map((locale) => tag + ":" + locale)
            .forEach((k) => tags[k] = 'kv');
        }
      }
      break;
    case "string":
    case "number":
      break;
    default:
      throw new TypeError("Unexpected eval type " + JSON.stringify(expr));
  }
}

module.exports = {
  evalExpr: evalExpr,
  appendKnownTags: appendKnownTags
};
