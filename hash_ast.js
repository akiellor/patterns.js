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
      results[result.hash].locations = [node.loc.start.line];
      results[result.hash].size = node.source().length;
    } else {
      results[result.hash].locations.push(node.loc.start.line);
    }
  });
  return results;
};

