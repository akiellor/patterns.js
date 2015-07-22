var falafel = require('falafel');
var hashNode = require(__dirname + '/hash_node');

module.exports = function hashAst(name, source) {
  var hashes = {};
  var results = {};
  falafel(source, {
    locations: true
  }, function(node) {
    var result = hashNode(name, hashes, node);
    if (!results[result.hash]) {
      results[result.hash] = result;
      results[result.hash].count = 1;
    } else {
      results[result.hash].count += 1;
    }
  });
  return results;
};

