'use strict';
function series(fns, getFrame, callback) {
  if (fns.length == 0) {
    return callback();
  }

  var current = 0;

  function next() {
    if (current >= fns.length) {
      callback();
    } else {
      getFrame(() => fns[current++](next));
    }
  }

  next();
}

module.exports.series = series;
