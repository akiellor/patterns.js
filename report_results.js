module.exports = function reportResults(results) {
  return Object.keys(results).reduce(function(memo, key) {
    memo += key + '\n';
    results[key].files.forEach(function(file) {
      memo += file + '\n';
    });
    return memo;
  }, '');
};
