var stackModel = require('../../app/stackModel');
var expect = require('chai').expect;
var env = require('../../config/env')('test');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(env.databaseUri);
var data = require('mockData')();

describe('stack', function(){
  beforeEach(function(done){
    var counter = data.length;
    data.forEach(function(value){
      userModel.create(value, function(err, result){
        counter++;
        if (counter === data.length){
          done();
        }
      });
    });
  });

  afterEach(function(done){
    db.query('MATCH (a), ()-[r]-() DELETE a, r', {}, done)
  });

  describe('get stack', function(done){
    it('should get something', function(done){
      stackModel.getStack({userId: '1'}, function(err, results){
        expect(err).to.equal(null);
        expect(results.length).to.equal(2);
      })
    });

  });

  describe('approving', function(done){


  });

  describe('rejecting', function(done){


  });
});