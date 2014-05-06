var userModel = require('../../app/userModel');
var expect = require('chai').expect;
var env = require('../../config/env')('test');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(env.databaseUri);

var linkedinData = require('./linkedinData');

describe('User Model', function(){
  
  it('should error when trying to create a new user with bad data', function(done){
    userModel.create({}, function(err){
      expect(err).to.not.equal(null);
      done();
    });
  });

  it('should create a new user in the database', function(done){
    userModel.create(linkedinData, function(err, results){
      expect(err).to.equal(null);
      expect(results[0]).to.exist;
      done();
    });
  });
  
  describe('using mock data', function(){
    beforeEach(function(done){
      userModel.create(linkedinData, function(err, result){
        done();
      });
    });

    afterEach(function(done){
      userModel.del(linkedinData, function(err){
        expect(err).to.equal(null);
        db.query(
          'MATCH (user:User {userId:{userId}}) RETURN user.userId',
          {userId: linkedinData.userId}, 
        function(err, result){
          expect(result.length).to.equal(0);
          done();
        });
      });
    });

  });
  
});
