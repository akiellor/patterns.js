module.exports = function filterResults(results) {
  return Object.keys(results).reduce(function(memo, key) {
    if (results[key].locations.length > 1 && results[key].size >= 300) {
      memo[key] = results[key];
    }
    return memo;
  }, {});
};
