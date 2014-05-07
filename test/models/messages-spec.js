
process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
    env = require('../../config/env')('test'),
    Message = require('../../app/models/messages/');

describe('Message model', function(){

  describe('get all messages', function(){
    
    it('should return an error with no userId', function(done) {
      Message.getAll({
        // no params given
      }, function(err, messages) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it('should return data with a valid userId', function(done) {
      Message.getAll({
        userId: '1'
      }, function(err, messages) {
        expect(err).to.equal(null);
        expect(Array.isArray(messages)).to.be.true;
        done();
      });
    });

  });

  describe('get one message', function() {

    it('should return an error without a userId', function(done) {
      Message.getOne({
        // no params given
      }, function(err, messages) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    // it('should return an error with only some of the valid params given', function(done) {
    //   // var query = [
    //   //   'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User {userId:{otherId}}),',
    //   //   '(other)-[:WORKS_FOR]->(company:Company)',
    //   //   'WITH other, c, company',
    //   //   'LIMIT 1',
    //   //   'MATCH path=(c)-[*]->(m:Message)',
    //   //   'WHERE m.time > {mostRecentMsg}',
    //   //   'RETURN DISTINCT other, c.connectDate as connectDate, collect(m) as messages'
    //   // ].join('\n');
    //
    //   var query = [
    //     'MATCH (user { userId: {userId}})-[r1:HAS_CONVERSATION]->(conversation)-[r2]->(other)',
    //     'WHERE type(r1)=type(r2)',
    //     'AND other.userId = {otherId}',
    //     'RETURN conversation'
    //   ].join('\n');
    //
    //   var params = {
    //     userId: '1'
    //     // otherId: undefined,
    //     // mostRecentMsg: 'hi'
    //   };
    //
    //   db.query(query, function(err, results) {
    //     console.log('err', err);
    //     console.log('results', results);
    //     expect(err).to.not.equal(null);
    //     done();
    //   });
    //
    //
    //   // Message.getOne({
    //   //   userId: 'a',
    //   //   otherId: 'a',
    //   //   mostRecentMsg: undefined
    //   //   // no mostRecentMsg param
    //   // }, function(err, messages) {
    //   //   console.log('messages', messages);
    //   //   expect(err).to.not.equal(null);
    //   //   done();
    //   // });
    // });

  });
  
  describe('send message (create)', function(){
    
    it('should return an error with invalid params', function(done) {
      Message.sendMessage({
        // no params given
      }, function(err, messages) {
        expect(err).to.not.equal(null);
        done();
      });
    });

    it('should return null as results on successful creation', function(done) {
      Message.sendMessage({
        userId: '1',
        otherId: '2',
        text: 'hello',
        time: new Date().getTime()
      }, function(err, messages) {
        expect(err).to.equal(null);
        expect(Array.isArray(messages)).to.be.true;
        done();
      });
    });

  });

});





//     beforeEach(function(done){
//       userModel.create(linkedinData, function(err, result){
//
//         done();
//       });
//     });
//
//     afterEach(function(done){
//       userModel.del(linkedinData, function(err){
//         expect(err).to.not.equal(null);
//         db.query(
//           'MATCH (user:User {userId:{userId}}) RETURN user.userId',
//           {userId: linkedinData.userId}, 
//         function(err, result){
//           expect(result.length).to.equal(0);
//           done();
//         });
//       });
//     });
//
//     it('should exist in the database', function(done){
//       db.query(
//         'MATCH (user:User {userId:{userId}}) RETURN user.userId',
//         {userId: linkedinData.userId}, 
//       function(err, result){
//         expect(result.length).to.equal(1);
//         done();
//       });
//     });
//
//     it('should belong to a cluster', function(done){
//       db.query(
//         'MATCH (:User {userId:{userId}})-[BELONGS_TO]->(c:Cluster) RETURN id(c)',
//         {userId: linkedinData.userId}, 
//       function(err, result){
//         expect(result.length).to.equal(1);
//         done();
//       });
//     });
//
//   });
// });
