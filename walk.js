var esprima = require('esprima');
var falafel = require('falafel');

function walk(source, cb) {
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
    return cb(node);
  })
}

module.exports = walk;

