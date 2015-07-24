module.exports = function reportResults(results) {
  return Object.keys(results).reduce(function(memo, key) {
    memo += key + '\n';
    memo += results[key].source + '\n';
    results[key].locations.forEach(function(file) {
      memo += file + '\n';
    });
    return memo;
  }, '');
};
