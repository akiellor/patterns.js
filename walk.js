var falafel = require('falafel');
var parser = require('./parser.js');

function walk(source, cb) {
  falafel(source, {
    parser: parser
  }, function(node) {
    node.start = node.range[0];
    node.end = node.range[1];
    return cb(node);
  })
}

module.exports = walk;

