var escodegen = require('escodegen');

function generate(type, rawStatistics) {
  rawStatistics = rawStatistics || {};

  var nodeCategory = {
    'Expression': ['Literal', 'BinaryExpression', 'Identifier', 'ArrayExpression', 'ThisExpression', 'MemberExpression', 'CallExpression', 'AssignmentExpression', 'FunctionExpression', 'ObjectExpression', 'UpdateExpression', 'UnaryExpression'],
    'Statement': ['WhileStatement', 'VariableDeclaration', 'FunctionDeclaration', 'ExpressionStatement', 'ForInStatement', 'ForStatement', 'IfStatement']
  };

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
    generator('UnaryExpression', {argument: 'Expression'}, {operator: '+'}) 
  ];

  function buildCdf(stats) {
    var result = {};
    Object.keys(stats).forEach(function(nodeType) {
      result[nodeType] = result[nodeType] || {};
      Object.keys(stats[nodeType]).forEach(function(prop) {
        result[nodeType][prop] = result[nodeType][prop] || [];
        Object.keys(stats[nodeType][prop]).forEach(function(childType, idx) {
          var previous = result[nodeType][prop][idx - 1];
          var sum = (previous && previous.range[1] || 0);
          var count = stats[nodeType][prop][childType];
          result[nodeType][prop].push({
            type: childType,
            count: count,
            range: [sum, sum + count]
          });
        });
      });
    });
    return result;
  }

  var statistics = buildCdf(rawStatistics);
  var gen = gens.filter(function(gen) { return gen.name === type; })[0];
  var deps = gen.props.map(function(prop) {
    var category = prop.type;
    var stats = statistics[type] && statistics[type][prop.name];
    if (stats && stats.length > 0) {
      var sum = stats[stats.length - 1].range[1];
      var idx = Math.floor(Math.random() * sum) + 1;
      var entry = stats.filter(function(entry) {
        return entry.range[0] < idx && idx <= entry.range[1];
      })[0];
      return generate(entry.type);
    } else {
      var childType = (nodeCategory[category] && nodeCategory[category][Math.floor(Math.random() * nodeCategory[category].length)]) || category;
      return generate(childType);
    }
  });
  return gen.deps[gen.deps.length - 1].apply(null, deps);
}

module.exports = function(type, rawStatistics) {
  return escodegen.generate(generate(type, rawStatistics));
};
