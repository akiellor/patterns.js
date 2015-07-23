var expect = require('chai').expect;
var hashAst = require(__dirname + '/../hash_ast');

describe('hash ast', function() {
  it('should generate hash tree', function() {
    var source = 'var a = 1;';

    var results = hashAst('stdin', source);

    expect(results).to.deep.equal({
      '4e7fc9d51ebd05e73144c4171b0792f41c622d7c':
      {
        hash: '4e7fc9d51ebd05e73144c4171b0792f41c622d7c',
        children: [],
        locations: [1],
        size: 1
      },
      '46d9ef09e7d06027eb767cc959397889a40a342b':
      {
        hash: '46d9ef09e7d06027eb767cc959397889a40a342b',
        children: [],
        locations: [1],
        size: 1
      },
      '57b112fbb09aa1efa84ee939fb69b8863d2d77a9':
      {
        hash: '57b112fbb09aa1efa84ee939fb69b8863d2d77a9',
        children:
        ['4e7fc9d51ebd05e73144c4171b0792f41c622d7c',
          '46d9ef09e7d06027eb767cc959397889a40a342b'],
        locations: [1],
        size: 5
      },
      'bf3fbcaa0355807e800742382728ea20b7f42644':
      {
        hash: 'bf3fbcaa0355807e800742382728ea20b7f42644',
        children: ['57b112fbb09aa1efa84ee939fb69b8863d2d77a9'],
        locations: [1],
        size: 10
      },
      '7c9c51d4265bb45b506a58aeb4ae5a4298d2b18a':
      {
        hash: '7c9c51d4265bb45b506a58aeb4ae5a4298d2b18a',
        children: ['bf3fbcaa0355807e800742382728ea20b7f42644'],
        locations: [1],
        size: 10
      }
    });
  });
});
