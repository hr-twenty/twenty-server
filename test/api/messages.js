var expect = require('chai').expect;

var db = require('../../app/db');
var app = require('../../server');
var Session = require('supertest-session')({app:app});

describe('messaging system', function(){
  var session;

  beforeEach(function(){
    session = new Session();
  })
  
  it('should respond', function(done) {
    session
    .get('/')
    .expect(404)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should respond with 400 when missing a userId', function(done) {
    session
    .get(host + '/conversations/all', 
    .expect(400)
    .end(function(err, res) {
      
      done();
    });
  });

})
