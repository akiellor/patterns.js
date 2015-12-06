import csp from 'js-csp';
import { edit } from './assistant/actions.js';

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
          context: node.source(),
          options: {
            edit: edit(node.file, node.loc.start.line)
          }
        };
        yield csp.put(result, refactor);
      }
    }
  });
  return result;
}
