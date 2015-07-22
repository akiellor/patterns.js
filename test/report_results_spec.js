var expect = require('chai').expect;
var reportResults = require(__dirname + '/../report_results');

describe('report results', function() {
  it('should print results nicely', function() {
    var display = reportResults({
      '123': {hash: '123', children: [], count: 12, files: ['foo.js', 'bar.js']},
      '456': {hash: '456', children: [], count: 7, files: ['foo.js']}
    });

    expect(display).to.equal(
      '123\n' +
      'foo.js\n' +
      'bar.js\n' +
      '456\n' +
      'foo.js\n'
    );
  });
});
