var userModel = require('../../app/userModel');
var expect = require('chai').expect;
var db = require('../../app/db')

describe('user', function(){
  var linkedinData = {

    
  };

  describe('creating and deleting', function(done){
    beforeEach(function(done){
      userModel.create(linkedinData, function(err, result){

        done();
      });
    });

    afterEach(function(done){
      userModel.del(linkedinData, function(err){
        expect(err).to.not.equal(null);
        db.query(
          'MATCH (user:User {userId:{userId}}) RETURN user.userId',
          {userId: linkedinData.userId}, 
        function(err, result){
          expect(result.length).to.equal(0);
          done();
        });
      });
    });

    it('should exist in the database', function(done){
      db.query(
        'MATCH (user:User {userId:{userId}}) RETURN user.userId',
        {userId: linkedinData.userId}, 
      function(err, result){
        expect(result.length).to.equal(1);
        done();
      });
    });

    it('should belong to a cluster', function(done){
      db.query(
        'MATCH (:User {userId:{userId}})-[BELONGS_TO]->(c:Cluster) RETURN id(c)',
        {userId: linkedinData.userId}, 
      function(err, result){
        expect(result.length).to.equal(1);
        done();
      });
    });

  });
});