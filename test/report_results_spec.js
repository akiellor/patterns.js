var expect = require('chai').expect;
var reportResults = require(__dirname + '/../report_results');

describe('report results', function() {
  it('should print results nicely', function() {
    var output = reportResults(-1, {
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

    expect(output.exitCode).to.equal(0);
    expect(output.data).to.equal(
      '123\n' +
      'var a = 1;\n' +
      'foo.js:1\n' +
      'bar.js:2\n' +
      '456\n' +
      'var b = 1;\n' +
      'foo.js:2\n'
    );
  });

  it('should report bad exit code if too many duplications', function() {
    var output = reportResults(0, {
      '123': {
        hash: '123',
        children: [],
        locations: ['foo.js:1', 'bar.js:2'],
        source: 'var a = 1;'
      }
    });

    expect(output.exitCode).to.equal(1);
  });

  it('should not report bad exit code if allowable duplications', function() {
    var output = reportResults(1, {
      '123': {
        hash: '123',
        children: [],
        locations: ['foo.js:1', 'bar.js:2'],
        source: 'var a = 1;'
      }
    });

    expect(output.exitCode).to.equal(0);
  });
});
