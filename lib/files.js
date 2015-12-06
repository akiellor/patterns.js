import csp from 'js-csp';
import glob from 'glob';

export default function files(pattern) {
  const result = csp.chan();
  glob(pattern, function(err, files) {
    csp.operations.onto(result, files);
  });
  return result;
}


