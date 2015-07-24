var expect = require('chai').expect;
var reportResults = require(__dirname + '/../report_results');

describe('report results', function() {
  it('should print results nicely', function() {
    var display = reportResults({
      '123': {
        hash: '123',
        children: [],
        locations: ['foo.js:1', 'bar.js:2'],
        source: 'var a = 1;'
      },
      '456': {
        hash: '456',
        children: [],
        locations: ['foo.js:2'],
        source: 'var b = 1;'
      }
    });

    expect(display).to.equal(
      '123\n' +
      'var a = 1;\n' +
      'foo.js:1\n' +
      'bar.js:2\n' +
      '456\n' +
      'var b = 1;\n' +
      'foo.js:2\n'
    );
  });
});
