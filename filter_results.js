module.exports = function filterResults(results) {
  var filtered = Object.keys(results).reduce(function(memo, key) {
    if (results[key].locations.length > 1 && results[key].source.length >= 300) {
      memo[key] = results[key];
    }
    return memo;
  }, {});

  var covered = {};
  Object.keys(filtered).forEach(function(key) {
    var coveredKey = covered[key] || key;
    covered[key] = coveredKey;
    results[key].children.forEach(function(child) {
      covered[child] = coveredKey;
    });
  });

  var out = {};
  Object.keys(covered).forEach(function(key) {
    if (covered[key] === key) {
      out[key] = results[key];
    }
  });
  return out;
};
