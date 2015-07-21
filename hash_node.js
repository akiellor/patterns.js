var crypto = require('crypto');

function hash(string) {
  var shasum = crypto.createHash('sha1');
  shasum.update(string);
  return shasum.digest('hex');
}

function hashNode(prefix, hashes, node) {
  function nodeKey(node) {
    return prefix + ":" + node.start + ":" + node.end;
  }

  function hashNodeCollection(hashes, nodeCollection) {
    var content = "";
    nodeCollection.forEach(function(node) {
      content = content + getHash(node);
    });
    return hash(content);
  }

  function getHash(node) {
    return hashes[nodeKey(node)].hash;
  }

  var hashers = {
    Literal: function(node) {
      return {
        hash: hash(node.raw),
        children: []
      };
    },
    Identifier: function(node) {
      return {
        hash: hash(node.type),
        children: []
      };
    },
    VariableDeclarator: function(node) {
      var idHash = getHash(node.id);
      var initHash = node.init && getHash(node.init) || "";
      return {
        hash: hash(node.type + idHash + initHash),
        children: [
          idHash,
          initHash
        ]
      };
    },
    VariableDeclaration: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.declarations)),
        children: [hashNodeCollection(hashes, node.declarations)]
      };
    },
    Program: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.body)),
        children: [hashNodeCollection(hashes, node.body)]
      };
    },
    BlockStatement: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.body)),
        children: [hashNodeCollection(hashes, node.body)]
      };
    },
    FunctionDeclaration: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.params) + getHash(node.body)),
        children: [
          hashNodeCollection(hashes, node.params),
          getHash(node.body)
        ]
      };
    },
    ArrayExpression: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.elements)),
        children: [hashNodeCollection(hashes, node.elements)]
      };
    },
    ExpressionStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.expression)),
        children: [getHash(node.expression)]
      };
    },
    ThisExpression: function(node) {
      return hash(node.type);
    },
    MemberExpression: function(node) {
      return {
        hash: hash(node.type + getHash(node.object) + getHash(node.property)),
        children: [
          getHash(node.object),
          getHash(node.property)
        ]
      };
    },
    CallExpression: function(node) {
      return {
        hash: hash(node.type + getHash(node.callee) + hashNodeCollection(hashes, node.arguments)),
        children: [
          getHash(node.callee),
          hashNodeCollection(hashes, node.arguments)
        ]
      };
    },
    AssignmentExpression: function(node) {
      return {
        hash: hash(node.type + node.operator + getHash(node.left) + getHash(node.right)),
        children: [
          node.operator,
          getHash(node.left),
          getHash(node.right)
        ]
      };
    },
    FunctionExpression: function(node) {
      return {
        hash: hash(node.type + getHash(node.body) + hashNodeCollection(hashes, node.params)),
        children: [
          getHash(node.body),
          hashNodeCollection(hashes, node.params)
        ]
      };
    },
    Property: function(node) {
      return {
        hash: hash(node.type + getHash(node.key) + getHash(node.value)),
        children: [
          getHash(node.key),
          getHash(node.value)
        ]
      };
    },
    ObjectExpression: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.properties)),
        children: [hashNodeCollection(hashes, node.properties)]
      };
    },
    ReturnStatement: function(node) {
      return {
        hash: hash(node.type + (node.argument ? getHash(node.argument) : '')),
        children: [node.argument ? getHash(node.argument) : '']
      };
    },
    ForInStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.left) + getHash(node.right) + getHash(node.body)),
        children: [
          getHash(node.left),
          getHash(node.right),
          getHash(node.body)
        ]
      };
    },
    NewExpression: function(node) {
      return {
        hash: hash(node.type + getHash(node.callee) + hashNodeCollection(hashes, node.arguments)),
        children: [
          getHash(node.callee),
          hashNodeCollection(hashes, node.arguments)
        ]
      };
    },
    ThrowStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.argument)),
        children: [getHash(node.argument)]
      };
    },
    BinaryExpression: function(node) {
      return {
        hash: hash(node.type + node.operator + getHash(node.left) + getHash(node.right)),
        children: [
          node.operator,
          getHash(node.left),
          getHash(node.right)
        ]
      };
    },
    UpdateExpression: function(node) {
      return {
        hash: hash(node.type + node.operator + getHash(node.argument)),
        children: [
          node.operator,
          getHash(node.argument)
        ]
      };
    },
    ForStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.init) + getHash(node.test) + getHash(node.update) + getHash(node.body)),
        children: [
          getHash(node.init),
          getHash(node.test),
          getHash(node.update),
          getHash(node.body)
        ]
      };
    },
    IfStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.test) + getHash(node.consequent) + (node.alternate ? getHash(node.alternate) : '')),
        children: [
          getHash(node.test),
          getHash(node.consequent),
          node.alternate ? getHash(node.alternate) : ''
        ]
      };
    },
    UnaryExpression: function(node) {
      return {
        hash: hash(node.type + node.operator + getHash(node.argument)),
        children: [
          node.operator,
          getHash(node.argument)
        ]
      };
    },
    LogicalExpression: function(node) {
      return {
        hash: hash(node.type + node.operator + getHash(node.left) + getHash(node.right)),
        children: [
          node.operator,
          getHash(node.left),
          getHash(node.right)
        ]
      };
    },
    ConditionalExpression: function(node) {
      return {
        hash: hash(node.type + getHash(node.test) + getHash(node.consequent) + getHash(node.alternate)),
        children: [
          getHash(node.test),
          getHash(node.consequent),
          getHash(node.alternate)
        ]
      };
    },
    BreakStatement: function(node) {
      return hash(node.type);
    },
    SequenceExpression: function(node) {
      return {
        hash: hash(node.type + hashNodeCollection(hashes, node.expressions)),
        children: [hashNodeCollection(hashes, node.expressions)]
      };
    },
    EmptyStatement: function(node) {
      return hash(node.type);
    },
    DebuggerStatement: function(node) {
      return hash(node.type);
    },
    CatchClause: function(node) {
      return {
        hash: hash(node.type + getHash(node.param) + getHash(node.body)),
        children: [
          getHash(node.param),
          getHash(node.body)
        ]
      };
    },
    TryStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.block) + getHash(node.handler)),
        children: [
          getHash(node.block),
          getHash(node.handler)
        ]
      };
    },
    SwitchCase: function(node) {
      return {
        hash: hash(node.type + (node.consequent ? getHash(node.consequent) : '') + (node.test ? getHash(node.test) : '')),
        children: [
          node.consequent ? getHash(node.consequent) : '',
          node.test ? getHash(node.test) : ''
        ]
      };
    },
    SwitchStatement: function(node) {
      return {
        hash: hash(node.type + getHash(node.discriminant) + hashNodeCollection(hashes, node.cases)),
        children: [
          getHash(node.discriminant),
          hashNodeCollection(hashes, node.cases)
        ]
      };
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
