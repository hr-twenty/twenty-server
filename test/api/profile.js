var expect = require('chai').expect;

var db = require('../../app/db');
var app = require('../../server');
var Session = require('supertest-session')({app:app});

describe('user profile', function(){
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

})
