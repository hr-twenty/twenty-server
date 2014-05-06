var userModel = require('../../app/userModel');
var expect = require('chai').expect;
var env = require('../../config/env')('test');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(env.databaseUri);


describe('user', function(){
  var linkedinData = {
    userId: '1',
    firstName:'Shane', 
    lastName:'Keller', 
    headline:'booya grandma!', 
    picture:'url', 
    numConnections:4, 
    locationCity:'San Francisco', 
    locationCountry:'USA',
    industryName: 'Software',
    curPositionTitle: 'Software Engineer',
    curCompanyName: 'Hack Reactor',
    curCompanyStartDate: '4-1-2014',
    curCompanyEndDate: 'Present',
    companySize: '1-49',
    languageName: 'English',
    languageProficiency: 'Native speaker',
    skillName: 'Angular.JS',
    schoolName: 'USC',
    schoolFieldOfStudy: 'Economics',
    schoolStartDate: '8-1-2005',
    schoolEndDate: '5-1-2010'
  };

  describe('created user', function(done){
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

    it('should exist in the database', function(done){
      db.query(
        'MATCH (user:User {userId:{userId}}) RETURN user.userId',
        {userId: linkedinData.userId}, 
      function(err, result){
        expect(err).to.equal(null);
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