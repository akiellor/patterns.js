function detectStringConcatenation(prefix, hashes, node) {
  function nodeKey(node) {
    return prefix + ":" + node.type + ':' + node.start + ":" + node.end;
  }

  function getHash(node) {
    return hashes[nodeKey(node)].hash;
  }

  var result = {};
  if (node.type === 'BinaryExpression' && node.operator === '+' && (getHash(node.left) === detectStringConcatenation.FOUND || (node.left.type === 'Literal' && typeof node.left.value === 'string'))) {
    result.hash = detectStringConcatenation.FOUND;
  } else {
    result.hash = detectStringConcatenation.MISSING;
  }
  hashes[nodeKey(node)] = result;
  return result;
};

detectStringConcatenation.FOUND = Math.random().toString();
detectStringConcatenation.MISSING = Math.random().toString();

module.exports = detectStringConcatenation;
