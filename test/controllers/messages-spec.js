
process.env.NODE_ENV = 'test';

var should = require('should'),
    request = require('request'),
    express = require('express'),
    passport = require('passport'),
    env = require('../../env')('test'),
    app = express();


describe('Messages api', function() {

  var server,
      host = 'http://' + env.ip + ':' + env.port;

  before(function(done) {
    require('../../config/express')(app, express, env);
    require('../../config/passport')(app, passport, env.ip, env.port);
    require('../../config/routes')(app, passport);
    server = app.listen(env.port);
    done();
  });

  after(function(done) {
    server.close();
    done();
  });

  describe('index action (/conversations/all)', function() {
    it('should respond with 400 when missing a userId', function(done) {
      request.get(host + '/conversations/all', function(err, res) {
        res.statusCode.should.equal(400);
        done();
      });
    });

    // it('should respond with 200 on success', function(done) {
    //   request.get(host + '/conversations/all?userId=LlcbXt5tlt', function(err, res) {
    //     res.statusCode.should.equal(200);
    //     done();
    //   });
    // });
  });

  describe('create action', function() {
    // it('should respond with 201 on success', function(done) {
    //   request.post({
    //     url: host + '/conversations/one',
    //     headers: { 'content-type': 'application/json' },
    //     body: JSON.stringify([{}])
    //   }, function(err, res) {
    //     res.statusCode.should.equal(201);
    //     done();
    //   })
    // });
  });

  describe('show action (/conversations/one)', function() {
    it('should respond with 400 when missing a userId, otherId, text and time', function(done) {
      request.get(host + '/conversations/one', function(err, res) {
        res.statusCode.should.equal(400);
        done();
      });
    });

    // it('should respond with 200 on success', function(done) {
    //   request.get(host + '/conversations/one?userId=LlcbXt5tlt&', function(err, res) {
    //     res.statusCode.should.equal(200);
    //     done();
    //   });
    // });
  });

  // describe('update action', function() {
  //   it('should respond with 204 on success', function(done) {
  //     request.put({
  //       url: host + '/messages/1',
  //       headers: { 'content-type': 'application/json' },
  //       body: JSON.stringify([{}])
  //     }, function(err, res) {
  //       res.statusCode.should.equal(204);
  //       done();
  //     })
  //   });
  // });

  // describe('destroy action', function() {
  //   it('should respond with 204 on success', function(done) {
  //     request.del({
  //       url: host + '/messages/1',
  //       headers: { 'content-type': 'application/json' }
  //     }, function(err, res) {
  //       res.statusCode.should.equal(204);
  //       done();
  //     });
  //   });
  // });

});
