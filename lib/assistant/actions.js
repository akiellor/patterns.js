import csp from 'js-csp';

export function skip() {
  return csp.operations.fromColl([true]);
}

export function quit() {
  process.exit();
}
