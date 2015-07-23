var mergeResults = require(__dirname + '/../merge_results');
var expect = require('chai').expect;

describe('merge results', function() {
  it('should aggregate counts', function() {
    var merged = mergeResults([
      {
        file: 'foo.js',
        tree: {
          '123': {
            hash: "123",
            children: [],
            locations: [1]
          },
          '456': {
            hash: "456",
            children: [],
            locations: [2]
          }
        }
      },
      {
        file: 'bar.js',
        tree: {
          '123': {
            hash: "123",
            children: [],
            locations: [1]
          }
        }
      }
    ]);

    expect(merged).to.deep.equal({
      '123': {
        hash: '123',
        children: [],
        locations: ['foo.js:1', 'bar.js:1']
      },
      '456': {
        hash: '456',
        children: [],
        locations: ['foo.js:2']
      }
    });
  });
});
