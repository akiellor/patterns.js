var mergeResults = require(__dirname + '/../merge_results');
var expect = require('chai').expect;

describe('merge results', function() {
  it('should aggregate counts', function() {
    var merged = mergeResults([
      {
        file: 'foo.js',
        tree: {
          '123': {hash: "123", children: [], count: 5},
          '456': {hash: "456", children: [], count: 7}
        }
      },
      {
        file: 'bar.js',
        tree: {'123': {hash: "123", children: [], count: 7}}
      }
    ]);

    expect(merged).to.deep.equal({
      '123': {hash: '123', children: [], count: 12, files: ['foo.js', 'bar.js']},
      '456': {hash: '456', children: [], count: 7, files: ['foo.js']}
    });
  });
});
