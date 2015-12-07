#!/usr/bin/env babel-node --harmony

import escodegen from 'escodegen';
import parser from '../parser.js';
import refactorInterpolation from '../lib/refactor_interpolation.js';
import chai from 'chai';
const expect = chai.expect;


[
  ['"1" + "2"', '`12`'],
  ['"1" + foo', '`1${ foo }`'],
  ['foo + "1"', '`${ foo }1`'],
  ['foo() + "1"', '`${ foo() }1`'],
  ['foo + " " + bar + " " + baz', '`${ foo } ${ bar } ${ baz }`'],
  ['"" + string', '`${ string }`'],
  ['prefix + ":" + node.type + ":" + node.start + ":" + node.end',
   '`${ prefix }:${ node.type }:${ node.start }:${ node.end }`'],
  ['"Could not parse: " + name + " " + e.message',
   '`Could not parse: ${ name } ${ e.message }`'],
  ['a + b + c', '`${ a }${ b }${ c }`']
].forEach(function(expectation) {
  const [ input, output ] = expectation;
  const expression = parser.parse(input).body[0].expression;

  const refactored = refactorInterpolation(expression);

  expect(escodegen.generate(refactored)).to.equal(output);
});



