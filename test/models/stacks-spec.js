
process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    env = require('../../config/env')('test'),
    Stack = require('../../app/models/stacks/');

describe('Stack model', function() {

  describe('get', function() {
    
    it('should error without a userId', function(done) {
      Stack.getStack({
        // no userId
      }, function(err, stacks) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it('should return stacks with a userId', function(done) {
      Stack.getStack({
        userId: '1'
      }, function(err, stacks) {
        expect(err).to.equal(null);
        expect(Array.isArray(stacks)).to.be.true;
        done();
      });
    });
  
  });

  describe('approve', function() {
  
    it('should error without a userId and otherId', function(done) {
      Stack.approve({
        userId: '1'
        // no otherId
      }, function(err, stacks) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it('should return null with a userId and otherId', function(done) {
      Stack.approve({
        userId: '1',
        otherId: '2'
      }, function(err, stacks) {
        expect(err).to.equal(null);
        expect(Array.isArray(stacks)).to.be.true;
        done();
      });
    });
  
  });

  describe('reject', function() {

    it('should error without a userId and otherId', function(done) {
      Stack.reject({
        // no userId
        otherId: '2'
      }, function(err, stacks) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it('should return null with a userId and otherId', function(done) {
      Stack.reject({
        userId: '1',
        otherId: '2'
      }, function(err, stacks) {
        expect(err).to.equal(null);
        expect(Array.isArray(stacks)).to.be.true;
        done();
      });
    });
  
  });

  describe('resetStack', function() {

    it('should error without a userId', function(done) {
      Stack.resetStack({
        // no userId
      }, function(err, results) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it('should return a result with a userId', function(done) {
      Stack.resetStack({
        userId: '1'
      }, function(err, results) {
        expect(err).to.equal(null);
        expect(Array.isArray(results)).to.be.true;
        done();
      });
    });

  });

});

