module.exports = function reportResults(allowableFailures, results) {
  var display = Object.keys(results).reduce(function(memo, key) {
    memo += key + '\n';
    memo += results[key].source + '\n';
    results[key].locations.forEach(function(file) {
      memo += file + '\n';
    });
    return memo;
  }, '');

  var numberOfDuplications = Object.keys(results).length;
  var exitCode = (numberOfDuplications <= allowableFailures || allowableFailures === -1) ? 0 : 1;

  return {data: display, exitCode: exitCode};
};
