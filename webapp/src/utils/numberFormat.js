export function isInt(n) {
  if (n === '' || n === null) {
    return false;
  }

  return n % 1 === 0;
}
