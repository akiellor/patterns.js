var falafel = require('falafel');
var expect = require('chai').expect;
var generate = require(__dirname + "/../generate");
var statistics = require(__dirname + "/../statistics.json");

describe('generate', function() {
  it('should generate deterministic results for certain statistics', function() {
    var statistics = {
      'Program.body[]': {
        'ExpressionStatement': 1
      },
      'Program.body[].ExpressionStatement.expression': {
        'Literal': 1
      },
      'Program.body[].ExpressionStatement.expression.Literal.raw': {
        '0': 1
      }
    };

    var source = generate('Program', statistics);

    expect(source).to.equal('0;');
  });

  for (var i = 0; i < 100; i++) {
    it("should generate valid source code " + i, function() {
      var source = generate('FunctionDeclaration', statistics);

      falafel(source, function() {});
    });
  }
});
