import child_process from 'child_process';
import fs from 'fs';
import csp from 'js-csp';

export function editor(file, location) {
  var done = csp.chan();

  var vim = child_process.spawn('vim', [`+${location}`, file], {
    stdio: 'inherit'
  });

  vim.on('exit', function(code) {
    csp.go(function*() {
      yield csp.put(done, true);
    });
  });

  return done;
}
