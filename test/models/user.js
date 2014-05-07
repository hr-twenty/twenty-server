var userModel = require('../../app/userModel');
var expect = require('chai').expect;
var db = require('../../app/db')

describe('User Model', function(){
  var linkedinData = {'educations': {'values': [
                {'endDate': {'year': 2014},'fieldOfStudy': 'Economics','schoolName': 'USC','startDate': {'year': 2010}},
                {'endDate': {'year': 2010},'fieldOfStudy': 'Math','schoolName': 'Stanford','startDate': {'year': 2006}}
              ]},
            'firstName': 'Louis',
            'headline': 'The fact that you’re alive is amazing, so you don’t get to say “I’m bored."',
            'id': 'abc123',
            'industry': 'Software',
            'lastName': 'C.K.',
            'pictureUrl': 'http://en.wikipedia.org/wiki/File:Louis_CK_2012_Shankbone.JPG',
            'location': {'country': {'code': 'us'},'name': 'San Francisco Bay Area'},
            'numConnections': '200',
            'positions': {'values': [
                {'company': {'name': 'Google','size': '10000+'},'isCurrent': true,'startDate': {'month': '01','year': '2010'},'title': 'Software Engineer'},
                {'company': {'name': 'Twitter','size': '10000+'},'isCurrent': false,'startDate': {'month': '06','year': '2008'},'endDate': {'month': '12','year': '2010'},'title': 'Software Engineer'}
              ]},
            'skills': {'values': [
                {'skill': {'name': 'Javascript'}}, {'skill': {'name': 'Angular.js'}}, {'skill': {'name': 'Neo4j'}}
              ]}
            };

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
});
