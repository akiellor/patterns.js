import csp from 'js-csp';
import hashNode from '../hash_node.js';
import mergeResults from '../merge_results.js';
import filterResults from '../filter_results.js';
import { edit } from '../lib/assistant/actions.js';

export default function detectDuplications(nodesChan) {
  var resultChan = csp.chan();
  csp.go(function*() {
    const results = {};
    const hashes = {};
    while (true) {
      var node = yield csp.take(nodesChan);
      if (node === csp.CLOSED) {
        const mergableResults = Object.keys(results).map(function(filename) {
          return {file: filename, tree: results[filename]};
        })
        let duplications = filterResults(100, mergeResults(mergableResults));
        for (let duplicationHash in duplications) {
          let duplication = duplications[duplicationHash];
          let [file, lineNumber] = duplication.locations[0].split(':');
          var refactor = {
            name: 'duplication',
            context: duplication.source,
            options: {
              edit: edit(file, lineNumber)
            }
          };
          yield csp.put(resultChan, refactor);
        }
        resultChan.close();
        return;
      }

      var nodeSource = node.source();
      var result = hashNode(node.file, hashes, node);
      results[node.file] = results[node.file] || {};
      if (!results[node.file][result.hash]) {
        results[node.file][result.hash] = result;
        results[node.file][result.hash].file = node.file;
        results[node.file][result.hash].locations = [node.loc.start.line];
        results[node.file][result.hash].source = nodeSource;
      } else {
        results[node.file][result.hash].locations.push(node.loc.start.line);
        results[node.file][result.hash].source = nodeSource;
      }
    }
  });
  return resultChan;
}
