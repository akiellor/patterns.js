import csp from 'js-csp';
import files from '../lib/files.js';
import ui from '../lib/assistant/ui.js';
import traverse from '../lib/traverse.js';
import detectInterpolationCandidates from '../lib/detect_interpolation_candidates.js';
import detectDuplications from '../lib/detect_duplications.js';

var nodes = traverse(files(process.argv[2] || '*.js'));

var nodesMult = csp.operations.mult(nodes);

const detectors = [
  detectInterpolationCandidates,
  detectDuplications
];

const actions = csp.chan();

detectors.forEach(function(detector) {
  var detectorNodes = csp.chan();

  csp.operations.mult.tap(nodesMult, detectorNodes);

  csp.operations.pipe(detector(detectorNodes), actions, true);
});

ui(actions);
