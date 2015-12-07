import csp from 'js-csp';
import escodegen from 'escodegen';
import refactorInterpolation from './refactor_interpolation.js';
import fs from 'fs';
import { edit } from './assistant/actions.js';

function refactorAction(node, fn) {
  return function() {
    let root = node;
    while (root.parent) {
      root = root.parent;
    }
    node.update(escodegen.generate(fn(node)));
    const newSource = root.source();
    const filename = node.file;
    var result = csp.chan();
    fs.writeFile(filename, newSource, function(err) {
      csp.go(function*() {
        yield csp.put(result, true);
      });
    });
    return result;
  };
}

export default function detectInterpolationCandidates(nodesChan) {
  var result = csp.chan();
  csp.go(function*() {
    while (true) {
      var node = yield csp.take(nodesChan);
      if (node === csp.CLOSED) {
        result.close();
        return;
      }

      if ((node.parent && node.parent.type !== 'BinaryExpression') && node.type === 'BinaryExpression' && node.operator === '+' && (node.left.type === 'BinaryExpression' || (node.left.type === 'Literal' && typeof node.left.value === 'string'))) {
        var refactor = {
          name: 'interpolation-candidate',
          context: `${node.source()} -> ${escodegen.generate(refactorInterpolation(node))}`,
          options: {
            edit: edit(node.file, node.loc.start.line),
            refactor: refactorAction(node, refactorInterpolation)
          }
        };
        yield csp.put(result, refactor);
      }
    }
  });
  return result;
}
