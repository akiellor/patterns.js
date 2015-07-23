var expect = require('chai').expect;
var reportResults = require(__dirname + '/../report_results');

describe('report results', function() {
  it('should print results nicely', function() {
    var display = reportResults({
      '123': {
        hash: '123',
        children: [],
        locations: ['foo.js:1', 'bar.js:2']
      },
      '456': {
        hash: '456',
        children: [],
        locations: ['foo.js:2']
      }
    });

    expect(display).to.equal(
      '123\n' +
      'foo.js:1\n' +
      'bar.js:2\n' +
      '456\n' +
      'foo.js:2\n'
    );
  });
});
