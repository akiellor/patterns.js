var expect = require('chai').expect;
var filterResults = require(__dirname + '/../filter_results');

describe('filter results', function() {
  function generateSource(size) {
    var result = 'var ';
    for(var i = 0; i < (size - 9); i++) {
      result += 'a';
    }
    result += ' = 1;'
    return result;
  }

  it('should remove results with only a single occurance', function() {
    var input = {
      '123': {
        hash: '123',
        children: [],
        source: generateSource(11),
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      },
      '456': {
        hash: '456',
        children: [],
        source: generateSource(11),
        locations: ['foo.js:2']
      }
    };
    var filtered = filterResults(10, input);
    expect(filtered).to.deep.equal({
      '123': {
        hash: '123',
        children: [],
        source: input['123'].source,
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      }
    });
  });

  it('should remove results with size less than n characters', function() {
    var input = {
      '123': {
        hash: '123',
        children: [],
        source: generateSource(9),
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      },
      '456': {
        hash: '456',
        children: [],
        source: generateSource(10),
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      }
    };
    var filtered = filterResults(10, input);
    expect(filtered).to.deep.equal({
      '456': {
        hash: '456',
        children: [],
        source: input['456'].source,
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      }
    });
  });

  it('should remove results which are already covered by parent', function() {
    var input = {
      '123': {
        hash: '123',
        children: ['456'],
        source: generateSource(11),
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      },
      '456': {
        hash: '456',
        children: [],
        source: generateSource(10),
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      }
    };
    var filtered = filterResults(10, input);
    expect(filtered).to.deep.equal({
      '123': {
        hash: '123',
        children: ['456'],
        source: input['123'].source,
        locations: [
          'foo.js:1',
          'bar.js:2'
        ]
      }
    });
  });
});


