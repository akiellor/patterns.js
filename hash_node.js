var crypto = require('crypto');

function nodeKey(node) {
  return node.start + ":" + node.end;
}

function hash(string) {
  var shasum = crypto.createHash('sha1');
  shasum.update(string);
  return shasum.digest('hex');
}

function hashNodeCollection(hashes, nodeCollection) {
  var content = "";
  nodeCollection.forEach(function(node) {
    content = content + hashes[nodeKey(node)];
  });
  return hash(content);
}

function hashNode(hashes, node) {
  var hashers = {
    Literal: function(node) {
      return hash(node.raw);
    },
    Identifier: function(node) {
      return hash(node.type);
    },
    VariableDeclarator: function(node) {
      var idHash = hashes[nodeKey(node.id)];
      var initHash = node.init && hashes[nodeKey(node.init)] || "";
      return hash(node.type + idHash + initHash);
    },
    VariableDeclaration: function(node) {
      return hash(node.type + hashNodeCollection(hashes, node.declarations));
    },
    Program: function(node) {
      return hash(node.type + hashNodeCollection(hashes, node.body));
    },
    BlockStatement: function(node) {
      return hash(node.type + hashNodeCollection(hashes, node.body));
    },
    FunctionDeclaration: function(node) {
      return hash(
        node.type +
        hashNodeCollection(hashes, node.params) +
        hashes[nodeKey(node.body)]
      );
    },
    ArrayExpression: function(node) {
      return hash(node.type + hashNodeCollection(hashes, node.elements));
    },
    ExpressionStatement: function(node) {
      return hash(node.type + hashes[nodeKey(node.expression)]);
    },
    ThisExpression: function(node) {
      return hash(node.type);
    },
    MemberExpression: function(node) {
      return hash(node.type + hashes[nodeKey(node.object)] + hashes[nodeKey(node.property)]);
    },
    CallExpression: function(node) {
      return hash(
        node.type +
        hashes[nodeKey(node.callee)] +
        hashNodeCollection(hashes, node.arguments)
      );
    },
    AssignmentExpression: function(node) {
      return hash(node.type + node.operator + hashes[nodeKey(node.left)] + hashes[nodeKey(node.right)]);
    },
    FunctionExpression: function(node) {
      return hash(node.type + hashes[nodeKey(node.body)] + hashNodeCollection(hashes, node.params));
    },
    Property: function(node) {
      return hash(node.type + hashes[nodeKey(node.key)] + hashes[nodeKey(node.value)]);
    },
    ObjectExpression: function(node) {
      return hash(node.type + hashNodeCollection(hashes, node.properties));
    },
    ReturnStatement: function(node) {
      return hash(node.type + (node.argument ? hashes[nodeKey(node.argument)] : ""));
    },
    ForInStatement: function(node) {
      return hash(
        node.type +
        hashes[nodeKey(node.left)] +
        hashes[nodeKey(node.right)] +
        hashes[nodeKey(node.body)]
      );
    },
    NewExpression: function(node) {
      return hash(
        node.type +
        hashes[nodeKey(node.callee)] +
        hashNodeCollection(hashes, node.arguments)
      );
    },
    ThrowStatement: function(node) {
      return hash(node.type + hashes[nodeKey(node.argument)]);
    },
    BinaryExpression: function(node) {
      return hash(
        node.type +
        node.operator +
        hashes[nodeKey(node.left)] +
        hashes[nodeKey(node.right)]
      );
    },
    UpdateExpression: function(node) {
      return hash(node.type + node.operator + hashes[nodeKey(node.argument)]);
    },
    ForStatement: function(node) {
      return hash(
        node.type +
        hashes[nodeKey(node.init)] +
        hashes[nodeKey(node.test)] +
        hashes[nodeKey(node.update)] +
        hashes[nodeKey(node.body)]
      );
    },
    IfStatement: function(node) {
      return hash(
        node.type +
        hashes[nodeKey(node.test)] +
        hashes[nodeKey(node.consequent)] +
        (node.alternate ? hashes[nodeKey(node.alternate)] : "")
      );
    },
    UnaryExpression: function(node) {
      return hash(node.type + node.operator + hashes[nodeKey(node.argument)]);
    },
    LogicalExpression: function(node) {
      return hash(
        node.type +
        node.operator +
        hashes[nodeKey(node.left)] +
        hashes[nodeKey(node.right)]
      );
    },
    ConditionalExpression: function(node) {
      return hash(
        node.type +
        hashes[nodeKey(node.test)] +
        hashes[nodeKey(node.consequent)] +
        hashes[nodeKey(node.alternate)]
      );
    },
    BreakStatement: function(node) {
      return hash(node.type);
    },
    SequenceExpression: function(node) {
      return hash(node.type + hashNodeCollection(hashes, node.expressions));
    },
    EmptyStatement: function(node) {
      return hash(node.type);
    },
    DebuggerStatement: function(node) {
      return hash(node.type);
    }
  };

  var hasher = hashers[node.type] || (function(n) {
      throw new Error("unknown node type: " + node.type);
    });
  var key = nodeKey(node);
  var result = hasher(node);
  hashes[key] = result;
  return result;
}

module.exports = hashNode;
