module.exports = function reportResults(results) {
  return Object.keys(results).reduce(function(memo, key) {
    memo += key + '\n';
    results[key].locations.forEach(function(file) {
      memo += file + '\n';
    });
    return memo;
  }, '');
};
