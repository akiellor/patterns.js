var hashNode = require(__dirname + '/hash_node');
var walk = require(__dirname + '/walk');

module.exports = function hashAst(name, source, hashFunction) {
  hashFunction = hashFunction || hashNode;
  var hashes = {};
  var results = {};
  walk(source, function(node) {
    var nodeSource = node.source();
    var result = hashFunction(name, hashes, node);
    if (!results[result.hash]) {
      results[result.hash] = result;
      results[result.hash].locations = [node.loc.start.line];
      results[result.hash].source = nodeSource;
    } else {
      results[result.hash].locations.push(node.loc.start.line);
      results[result.hash].source = nodeSource;
    }
  });
  return results;
};

