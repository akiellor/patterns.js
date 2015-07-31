var expect = require('chai').expect;
var escodegen = require('escodegen');
var hashAst = require(__dirname + '/../hash_ast');

describe('hash ast', function() {
  it('should generate hash tree', function() {
    var source = 'var a = 1;';

    var results = hashAst('stdin', source);

    expect(results).to.deep.equal({
      '4e7fc9d51ebd05e73144c4171b0792f41c622d7c':
      {
        hash: '4e7fc9d51ebd05e73144c4171b0792f41c622d7c',
        children: [],
        locations: [1],
        source: 'a'
      },
      '46d9ef09e7d06027eb767cc959397889a40a342b':
      {
        hash: '46d9ef09e7d06027eb767cc959397889a40a342b',
        children: [],
        locations: [1],
        source: '1'
      },
      '57b112fbb09aa1efa84ee939fb69b8863d2d77a9':
      {
        hash: '57b112fbb09aa1efa84ee939fb69b8863d2d77a9',
        children:
        ['4e7fc9d51ebd05e73144c4171b0792f41c622d7c',
          '46d9ef09e7d06027eb767cc959397889a40a342b'],
        locations: [1],
        source: 'a = 1'
      },
      'bf3fbcaa0355807e800742382728ea20b7f42644':
      {
        hash: 'bf3fbcaa0355807e800742382728ea20b7f42644',
        children: ['57b112fbb09aa1efa84ee939fb69b8863d2d77a9'],
        locations: [1],
        source: 'var a = 1;'
      },
      '7c9c51d4265bb45b506a58aeb4ae5a4298d2b18a':
      {
        hash: '7c9c51d4265bb45b506a58aeb4ae5a4298d2b18a',
        children: ['bf3fbcaa0355807e800742382728ea20b7f42644'],
        locations: [1],
        source: 'var a = 1;'
      }
    });
  });

  it('ast hashed twice should be the same', function() {
    var ast = generate('BinaryExpression');
    var result = escodegen.generate(ast);
    console.log(result);

    expect(hashAst('stdin', result)).to.deep.equal(hashAst('stdin', result));
  });

  it('ast contained in other ast should contain the same children', function() {
  });

  function generate(type) {
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
          name: prop
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
      return {name: name, deps: deps};
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

    var gen = gens.filter(function(gen) { return gen.name === type; })[0];
    var deps = gen.deps.slice(0, -1).map(function(category) {
      var type = (nodeCategory[category] && nodeCategory[category][Math.floor(Math.random() * nodeCategory[category].length)]) || category;
      return generate(type);
    });
    return gen.deps[gen.deps.length - 1].apply(null, deps);
  }

});
