const flatten = arr => arr.reduce((memo, arr) => memo.concat(arr), []);
module.exports = flatten;