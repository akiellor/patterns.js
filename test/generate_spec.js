var falafel = require('falafel');
var generate = require(__dirname + "/../generate");
var statistics = require(__dirname + "/../statistics.json");

describe('generate', function() {
  for (var i = 0; i < 100; i++) {
    it("should generate valid source code " + i, function() {
      var source = generate('FunctionDeclaration', statistics);

      falafel(source, function() {});
    });
  }
});
