var falafel = require('falafel');
var acorn = require('acorn');
var hashNode = require(__dirname + '/hash_node');

module.exports = function hashAst(name, source) {
  var hashes = {};
  var results = {};
  falafel(source, {
    parser: {
      parse: function(source) {
        return acorn.parse(source, {locations: true, raw: true, range: true, sourceType: 'module'});
      }
    }
  }, function(node) {
    var nodeSource = node.source();
    var result = hashNode(name, hashes, node);
    if (!results[result.hash]) {
      results[result.hash] = result;
      results[result.hash].locations = [node.loc.start.line];
      results[result.hash].source = nodeSource;
    } else {
      results[result.hash].locations.push(node.loc.start.line);
    }
  });
  return results;
};

