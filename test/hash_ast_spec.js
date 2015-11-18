var expect = require('chai').expect;
var falafel = require('falafel');
var hashAst = require(__dirname + '/../hash_ast');
var generate = require('generate.js');

describe('hash ast', function() {
  for (var i = 0; i < 15; i++) {
    it('ast hashed twice should be the same ' + i, function() {
      var result = generate('FunctionDeclaration');

      expect(hashAst('stdin', result)).to.deep.equal(hashAst('stdin', result));
    });
  }

  for (var i = 0; i < 15; i++) {
    it('hash of child should exist in results for root ' + i, function() {
      var result = generate('FunctionDeclaration');
      var rootKeys = Object.keys(hashAst('stdin', result));

      falafel(result, function(node) {
        var childKeys = Object.keys(hashAst('stdin', node.source()));

        childKeys.forEach(function(key) {
          expect(rootKeys).to.contain(key);
        });
      });
    });
  }
});
