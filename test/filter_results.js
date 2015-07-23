var expect = require('chai').expect;
var filterResults = require(__dirname + '/../filter_results');

describe('filter results', function() {
  it('should remove results with only a single occurance', function() {
    var filtered = filterResults({
      '123': {
        hash: '123',
        children: [],
        size: 500,
        locations: ['foo.js:1', 'bar.js:2']
      },
      '456': {
        hash: '456',
        children: [],
        size: 500,
        locations: ['foo.js:2']
      }
    });

    expect(filtered).to.deep.equal({
      '123': {
        hash: '123',
        children: [],
        size: 500,
        locations: ['foo.js:1', 'bar.js:2']
      }
    });
  });

  it('should remove results with size less than 300 characters', function() {
    var filtered = filterResults({
      '123': {
        hash: '123',
        children: [],
        size: 299,
        locations: ['foo.js:1', 'bar.js:2']
      },
      '456': {
        hash: '456',
        children: [],
        size: 300,
        locations: ['foo.js:1', 'bar.js:2']
      }
    });

    expect(filtered).to.deep.equal({
      '456': {
        hash: '456',
        children: [],
        size: 300,
        locations: ['foo.js:1', 'bar.js:2']
      }
    });
  });
});


