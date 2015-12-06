import csp from 'js-csp';
import fs from 'fs';
import walk from '../walk.js';

function read(filename) {
  const result = csp.chan();
  fs.readFile(filename, function(err, buffer) {
    csp.go(function*() {
      yield csp.put(result, buffer.toString());
    });
  });
  return result;
}

export function traverse(chan) {
  var result = csp.chan(300000);
  csp.go(function*() {
    while (true) {
      let filename = yield csp.take(chan);
      if (filename === csp.CLOSED) {
        result.close();
        return;
      }
      let content = yield read(filename);
      var puts = [];
      walk(content, function(node) {
        puts.push(csp.go(function*() {
          node.file = filename;
          yield csp.put(result, node);
        }));
      });
      for (let put of puts) {
        yield put;
      }
    }
  });
  return result;
}
