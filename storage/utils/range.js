const range = (n, b = 0, fn = i => i) => new Array(n).fill(undefined).map((_, i) => fn(b + i));
module.exports = range;