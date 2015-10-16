var falafel = require('falafel');
var esprima = require('esprima');
var hashNode = require(__dirname + '/hash_node');

module.exports = function hashAst(name, source) {
  var hashes = {};
  var results = {};
  falafel(source, {
    parser: {
      parse: function(source) {
        try {
          return esprima.parse(source, {loc: true, raw: true, range: true, sourceType: 'module'});
        } catch (e) {
          throw new Error('Could not parse: ' + name + ' ' + e.message);
        }
      }
    }
  }, function(node) {
    node.start = node.range[0];
    node.end = node.range[1];
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

