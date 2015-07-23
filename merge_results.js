module.exports = function mergeResults(results) {
  return results.reduce(function(memo, resultSet) {
    Object.keys(resultSet.tree).forEach(function(key) {
      var locations = resultSet.tree[key].locations.map(function(loc) {
        return resultSet.file + ":" + loc;
      });
      if (!memo[key]) {
        memo[key] = resultSet.tree[key];
        memo[key].locations = locations;
      } else {
        memo[key].locations = memo[key].locations.concat(locations);
      }
    });
    return memo;
  }, {});
};
