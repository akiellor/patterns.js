module.exports = function mergeResults(results) {
  return results.reduce(function(memo, resultSet) {
    Object.keys(resultSet.tree).forEach(function(key) {
      if (!memo[key]) {
        memo[key] = resultSet.tree[key];
        memo[key].files = [resultSet.file];
      } else {
        memo[key].count += resultSet.tree[key].count;
        memo[key].files.push(resultSet.file);
      }
    });
    return memo;
  }, {});
};
