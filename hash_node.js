var crypto = require('crypto');

function hash(string) {
  var shasum = crypto.createHash('sha1');
  shasum.update('' + string);
  return shasum.digest('hex');
}

function hashNode(prefix, hashes, node) {
  function nodeKey(node) {
    return prefix + ":" + node.type + ':' + node.start + ":" + node.end;
  }

  function getHash(node) {
    return hashes[nodeKey(node)].hash;
  }

  function getChildHashes(nodeCollection) {
    return nodeCollection.map(getHash);
  }

  var blackList = ['update', 'source', 'parent', 'range', 'loc', 'start', 'end'];
  function reflectiveHasher(node) {
    var children = Array.prototype.concat.apply([], Object.keys(node).map(function(key) {
      if (blackList.indexOf(key) !== -1) {
        return [];
      }

      var value = node[key];
      if (value === null) {
        return hash('null');
      } else if(value.hasOwnProperty('type')) {
        return [getHash(value)];
      } else if (Array.isArray(value) && value.length > 0 && value[0].hasOwnProperty('type')) {
        return getChildHashes(value);
      } else {
        return [hash(value)];
      }
    }));

    return {
      hash: hash(children.join(',')),
      children: children
    };
  }
  var hasher = reflectiveHasher;
  var key = nodeKey(node);
  var result = hasher(node);
  hashes[key] = result;
  return result;
}

module.exports = hashNode;
