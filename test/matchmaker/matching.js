var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

var matching = require('../lib/matching')(db);

var expect = require('chai').expect;

describe('matching', function(){
  it('should return a stack', function(done){
    matching('3333333', function(err, results){
      expect(err).to.equal(null)
      expect(results.length > 0).to.equal(true)
      done()
    })
  })
})