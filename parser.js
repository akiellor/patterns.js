var esprima = require('esprima');

module.exports = {
  parse: function(source) {
    try {
      return esprima.parse(source, {loc: true, raw: true, range: true, sourceType: 'module'});
    } catch (e) {
      throw new Error('Could not parse: ' + name + ' ' + e.message);
    }
  }
};
