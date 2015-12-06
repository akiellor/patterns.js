import csp from 'js-csp';
import { editor } from './editor.js';

export function skip() {
  return csp.operations.fromColl([true]);
}

export function quit() {
  process.exit();
}

export function edit(file, lineNumber) {
  return function() {
    return editor(file, lineNumber);
  };
}

export const defaultActions = {
  skip: skip,
  quit: quit
};
