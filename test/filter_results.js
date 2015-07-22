var expect = require('chai').expect;
var filterResults = require(__dirname + '/../filter_results');

describe('filter results', function() {
  it('should remove results with only a single occurance', function() {
    var filtered = filterResults({
      '123': {hash: '123', children: [], count: 12, size: 500, files: ['foo.js', 'bar.js']},
      '456': {hash: '456', children: [], count: 1, size: 500, files: ['foo.js']}
    });

    expect(filtered).to.deep.equal({
      '123': {hash: '123', children: [], count: 12, size: 500, files: ['foo.js', 'bar.js']}
    });
  });

  it('should remove results with size less than 300 characters', function() {
    var filtered = filterResults({
      '123': {hash: '123', children: [], count: 12, size: 299, files: ['foo.js', 'bar.js']},
      '456': {hash: '456', children: [], count: 2, size: 300, files: ['foo.js']}
    });

    expect(filtered).to.deep.equal({
      '456': {hash: '456', children: [], count: 2, size: 300, files: ['foo.js']}
    });
  });
});


