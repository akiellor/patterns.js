var escodegen = require('escodegen');
var defaultStatistics = require(__dirname + '/statistics.json');

function buildCdf(stats) {
  var result = {};
  Object.keys(stats).forEach(function(key) {
    result[key] = result[key] || [];
    Object.keys(stats[key]).forEach(function(childType, idx) {
      result[key][childType] = result[key][childType] || [];
      var previous = result[key][idx - 1];
      var sum = (previous && previous.range[1] || 0);
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

function generator(name, blueprint, extras) {
  extras = extras || {};
  var deps = [];
  var props = [];
  for (var prop in blueprint) {
    var parts = blueprint[prop].split(':');
    deps.push(parts[parts.length - 1]);
    props.push({
      collection: parts.length > 1,
      name: prop,
      type: parts[parts.length - 1]
    });
  }
  deps.push(function() {
    var result = {};
    var args = Array.prototype.slice.call(arguments);
    result.type = name;
    args.forEach(function(e, i) {
      var prop = props[i];
      if (prop.collection) {
        result[prop.name] = [e];
      } else {
        result[prop.name] = e;
      }
    });
    Object.keys(extras).forEach(function(key) {
      result[key] = extras[key];
    });
    return result;
  });
  return {name: name, deps: deps, props: props};
}

var gens = [
  generator('Identifier', {}, {name: 'foo'}),
  generator('Literal', {}, {value: 40}),
  generator('VariableDeclarator', {id: 'Identifier'}),
  generator('VariableDeclaration', {declarations: 'list:VariableDeclarator'}, {kind: 'var'}),
  generator('BlockStatement', {body: "list:Statement"}),
  generator('FunctionDeclaration', {id: "Identifier", params: "list:Identifier", body: "BlockStatement"}),
  generator('ArrayExpression', {elements: "list:Expression"}),
  generator('WhileStatement', {test: 'Expression', body: 'BlockStatement'}),
  generator('BinaryExpression', {left: "Expression", right: "Expression"}, {operator: '==='}),
  generator('ExpressionStatement', {expression: "Expression"}),
  generator('ThisExpression', {}),
  generator('MemberExpression', {object: "Expression", property: "Identifier"}),
  generator('CallExpression', {callee: "Expression", arguments: "list:Expression"}),
  generator('AssignmentExpression', {left: "Identifier", right: "Expression"}, {operator: '='}),
  generator('FunctionExpression', {body: "BlockStatement", params: "list:Identifier"}),
  generator('ObjectExpression', {properties: "list:Property"}),
  generator('Property', {key: "Identifier", value: "Expression"}),
  generator('ReturnStatement', {argument: "Expression"}),
  generator('ForInStatement', {left: "Identifier", right: "Expression", body: "BlockStatement"}),
  generator('ThrowStatement', {argument: "Expression"}),
  generator('UpdateExpression', {argument: 'Identifier'}, {operator: '++'}),
  generator('ForStatement', {init: 'VariableDeclaration', test: 'BinaryExpression', update: 'UpdateExpression', body: 'BlockStatement'}),
  generator('IfStatement', {test: 'BinaryExpression', consequent: 'BlockStatement'}),
  generator('UnaryExpression', {argument: 'Expression'}, {operator: '+'}),
  generator('LogicalExpression', {left: 'Expression', right: 'Expression'}, {}),
  generator('ConditionalExpression', {test: 'Expression', consequent: 'Expression'}, {}),
  generator('BreakStatement', {}, {}),
  generator('NewExpression', {callee: 'Identifier', arguments: 'list:Expression'}, {}),
  generator('SequenceExpression', {}, {})
];

function generate(type, statistics) {
  var gen = gens.filter(function(gen) { return gen.name === type; })[0];
  var deps = gen.props.map(function(prop) {
    var category = prop.type;
    var stats = statistics[type + '.' + prop.name];
    var sum = stats[stats.length - 1].range[1];
    var idx = Math.floor(Math.random() * sum) + 1;
    var entry = stats.filter(function(entry) {
      return entry.range[0] < idx && idx <= entry.range[1];
    })[0];
    return generate(entry.type, statistics);
  });
  return gen.deps[gen.deps.length - 1].apply(null, deps);
}

module.exports = function(type, rawStatistics) {
  var statistics = buildCdf(rawStatistics || defaultStatistics);
  return escodegen.generate(generate(type, statistics));
};
