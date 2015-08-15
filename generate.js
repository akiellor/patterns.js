var escodegen = require('escodegen');
var defaultStatistics = require(__dirname + '/statistics.json');

function buildCumulativeDistribution(stats) {
  var result = {}
  Object.keys(stats).forEach(function(key) {
    result[key] = result[key] || [];
    Object.keys(stats[key]).forEach(function(childType, idx) {
      childType = '' + childType;
      var previous = result[key][idx - 1];
      var sum = (previous && previous.range && previous.range[1] || 0);
      var count = stats[key][childType];
      result[key].push({
        type: childType,
        count: count,
        range: [sum, sum + count]
      });
    });
  });
  return result;
}

function buildPropertyModel(stats) {
  var result = {};
  Object.keys(stats).forEach(function(key) {
    var parts = key.split('.');
    for (var i = 0; i < parts.length; i+=2) {
      var type = parts[i];
      var prop = parts[i + 1];
      result[type] = result[type] || [];
      if (result[type].indexOf(prop) === -1) {
        result[type].push(prop);
      }
    }
  });
  return result;
}

function sample(stats) {
  var sum = stats[stats.length - 1].range[1];
  var idx = Math.floor(Math.random() * sum) + 1;
  return stats.filter(function(entry) {
    return entry.range[0] < idx && idx <= entry.range[1];
  })[0];
}

function generate(path, statistics, propertyModel) {
  var type = path[path.length - 1];
  var props = propertyModel[type] || [];
  var deps = props.reduce(function(memo, prop) {
    var propPath = path.concat([prop]);
    var stats = statistics[propPath.join('.')];
    if (!stats) {
      return memo;
    }
    var entry = sample(stats);

    if (type === 'Literal' && prop === 'raw') {
      memo[prop] = entry.type;
    } else if (type === 'Literal' && prop === 'value') {
    } else if (type === 'Identifier' && prop === 'name') {
      memo[prop] = entry.type;
    } else if (prop === 'operator') {
      memo[prop] = entry.type;
    } else if (prop === 'kind') {
      memo[prop] = entry.type;
    } else if (prop.indexOf('[]') !== -1) {
      var childPath = propPath.slice(-4)
      childPath = childPath.concat([entry.type]);
      memo[prop.replace('[]', '')] = [
        generate(childPath, statistics, propertyModel)
      ];
    } else {
      var childPath = propPath.slice(-4)
      childPath = childPath.concat([entry.type]);
      memo[prop] = generate(childPath, statistics, propertyModel);
    }
    return memo;
  }, {});
  deps.type = type;
  if (type === 'Literal') {
    var value = require('esprima').parse(deps.raw).body[0].expression.value;
    deps.value = value;
  }
  return deps;
}

module.exports = function(type, rawStatistics) {
  var propertyModel = buildPropertyModel(rawStatistics || defaultStatistics);
  var statistics = buildCumulativeDistribution(rawStatistics || defaultStatistics, propertyModel);
  return escodegen.generate(
    generate([type], statistics, propertyModel),
    {
      parse: require('esprima').parse,
      raw: true
    }
  );
};
