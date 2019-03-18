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
    return isNaN(n) ? '' : n;
  },

  str: function (arg) {
    return '' + arg;
  },

  int: function (arg) {
    const n = parseInt(arg, 10);
    return isNaN(n) ? 0 : n;
  },

  tag: function (tags, arg) {
    return arg in tags ? tags[arg] : '';
  },

  sqrt: function (arg) {
    return Math.sqrt(arg);
  },

  cond: function (arg, if_exp, else_exp) {
    if (typeof(if_exp) === 'undefined') {
      if_exp = 'true';
    }

    if (typeof(else_exp) === 'undefined') {
      else_exp = 'false';
    }

    if (arg === '0' || arg === 'false' || arg === '') {
        return else_exp;
    } else {
        return if_exp;
    }
  },

  metric: function (arg) {
    if (/\d\s*mm$/.test(arg)) {
      return 1000 * parseInt(arg, 10);
    } else if (/\d\s*cm$/.test(arg)) {
      return 100 * parseInt(arg, 10);
    } else if (/\d\s*dm$/.test(arg)) {
      return 10 * parseInt(arg, 10);
    } else if (/\d\s*km$/.test(arg)) {
      return 0.001 * parseInt(arg, 10);
    } else if (/\d\s*in$/.test(arg)) {
      return 0.0254 * parseInt(arg, 10);
    } else if (/\d\s*ft$/.test(arg)) {
      return 0.3048 * parseInt(arg, 10);
    } else {
      return parseInt(arg, 10);
    }
  },

  // localize: function (tags, text) {
  //   var locales = MapCSS.locales, i, tag;
  //
  //   for (i = 0; i < locales.length; i++) {
  //       tag = text + ':' + locales[i];
  //       if (tags[tag]) {
  //           return tags[tag];
  //       }
  //   }
  //
  //   return tags[text];
  // },

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

    if (!/^[0-9]+$/.test(index) || index >= arr.length()) {
      return "";
    }

    return arr[index];
  },

  set: function(arr, index, text) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return [];
    }

    if (!/^[0-9]+$/.test(index)) {
      return [];
    }

    arr[index] = text;

    return arr;
  },

  count: function(arr) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return 0;
    }

    return arr.length();
  },

  list: function() {
    return arguments;
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

    lst.reverse();

    return lst;
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
      throw "Unexpected binary opertator in eval " + JSON.stringify(op);
  }
}

function evalFunc(func, args) {
  if (!(func in EVAL_FUNCTIONS)) {
    throw "Unexpected function in eval " + JSON.stringify(func);
  }

  return EVAL_FUNCTIONS[func].apply(this, args);
}

function evalExpr(expr, tags={}, actions={}) {
  switch (expr.type) {
    case "binary_op":
      return evalBinaryOp(evalExpr(expr.left), expr.op, evalExpr(expr.right));
    case "function":
      return evalFunc(expr.func, expr.args.map(evalExpr));
    case "string":
    case "number":
      return expr.value;
    default:
      throw "Unexpected eval type " + JSON.stringify(expr);
  }
}

function appendKnownTags(tags, expr) {
  switch (expr.type) {
    case "binary_op":
      appendKnownTags(tags, expr.left);
      appendKnownTags(tags, expr.right);
      break;
    case "function":
      if (expr.func == "tag" && expr.args.length == 1) {
        const tag = evalExpr(expr.args[0], {}, {});
        tags[tag] = 'kv';
      }
      break;
    case "string":
    case "number":
      break;
    default:
      throw "Unexpected eval type " + JSON.stringify(expr);
  }
}

module.exports = {
  evalExpr: evalExpr,
  appendKnownTags: appendKnownTags
};
