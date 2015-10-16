var Promise = require('promise');
var glob = Promise.denodeify(require('glob'));
var read = Promise.denodeify(require('fs').readFile);
var hashAst = require(__dirname + '/hash_ast');
var mergeResults = require(__dirname + '/merge_results');
var filterResults = require(__dirname + '/filter_results');

function getFileNames(patterns) {
  return Promise.all(patterns.map(function(pattern) {
    return glob(pattern, {})
  })).then(function(filesOfFiles) {
    return filesOfFiles.reduce(function(memo, files) {
      return memo.concat(files);
    }, []);
  });
}

function hashFiles(files) {
  return Promise.all(files.map(function(file) {
    return read(file).then(function(content) {
      return {file: file, tree: hashAst(file, content.toString())};
    });
  }));
}

module.exports = function(globs) {
  return getFileNames(globs)
    .then(hashFiles)
    .then(mergeResults)
    .then(filterResults);
};
