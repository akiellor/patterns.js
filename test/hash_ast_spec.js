var expect = require('chai').expect;
var hashAst = require(__dirname + '/../hash_ast');
var generate = require(__dirname + '/../generate');

describe('hash ast', function() {
  for (var i = 0; i < 15; i++) {
    it('ast hashed twice should be the same', function() {
      var result = generate('FunctionDeclaration');

      expect(hashAst('stdin', result)).to.deep.equal(hashAst('stdin', result));
    });
  }
});
