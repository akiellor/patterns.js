var expect = require('chai').expect;
var hashAst = require(__dirname + '/../hash_ast');
var detectStringConcatenation = require(__dirname + '/../detect_string_concatenation');

describe('detect string concatenation', function() {
  ['"a"\n+\n"b"', '"a"\n+\nb', '"a"\n+\nb\n+\n"c"'].forEach(function(expression) {
    it('should hash to find for ' + JSON.stringify(expression), function() {
      var result = hashAst('stdin', expression, detectStringConcatenation);
      expect(result[detectStringConcatenation.FOUND].source).to.equal(expression);
    });
  });

  ['a\n+\nb', '"a"\n+\nb\n-\n5', '1\n+\n"5"'].forEach(function(expression) {
    it('should hash to not find for ' + JSON.stringify(expression), function() {
      var result = hashAst('stdin', expression, detectStringConcatenation);
      expect(result[detectStringConcatenation.MISSING].source).to.equal(expression);
    });
  });
});
