/* global require, exports */
var db = require('./db');
var matchMaker = require('./matchmaker/matchmaker')();

/*--------Stack Methods-----------*/
exports.getStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(:Stack)-[:STACK_USER]->(other:User)-[:HAS_STACK]->(os:Stack)-[r2]->(user)',
    'WHERE type(r2) <> "REJECTED"',
    'OPTIONAL MATCH (other)-[r3]->(otherInfo)',
    'WHERE type(r3) <> "HAS_CONVERSATION"',
    'AND type(r3) <> "HAS_STACK"',
    'AND type(r3) <> "STACK_USER"',
    'AND type(r3) <> "APPROVED"',
    'RETURN other, collect(type(r3)) as relationships, collect(otherInfo) as otherNodeData, type(r2) as otherToUserRel',
    'ORDER BY type(r2)',
    'LIMIT 10'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      var updatedObj = {};
      updatedObj.otherToUserRel = obj.otherToUserRel;
      //get user data
      for(var key in obj.other.data){
        updatedObj[key] = obj.other.data[key];
      }
      //get all relationships
      for(var i = 0; i < obj.relationships.length; i++){
        updatedObj[obj.relationships[i]] = obj.otherNodeData[i].data;
      }
      return updatedObj;
    });

    // if(results.length < 10){
      clusterStack(data);
    // }

    callback(null, finalResults);
  });

};

//Add more users to this user's Stack based on cluster
var clusterStack = function(data){
  matchMaker.matches(data.userId, function(err, results){
    results.forEach(function(obj){
      // addUserToStack(data.userId, obj.otherId);
      console.log(obj);
    });
  });
};

//Add more users to this user's Stack if cluster isn't big enough
var moarStack = function(data){
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User)-[:HAS_STACK]->(os:Stack)',
    'WHERE user.userId <> other.userId',
    'AND NOT (us)-->(other)',
    'MERGE (us)-[:STACK_USER]->(other)',
    'MERGE (os)-[:STACK_USER]->(user)',
    'RETURN null'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err) {
    if (err) return (err);
  });
};

var addUserToStack = function(data){
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User {userId:{otherId}})-[:HAS_STACK]->(os:Stack)',
    'MERGE (us)-[:STACK_USER]->(other)',
    'MERGE (os)-[:STACK_USER]->(user)',
    'RETURN null'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err) {
    if (err) return (err);
  });
}

exports.approve = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[r1:STACK_USER]->(other:User {userId:{otherId}})',
    'OPTIONAL MATCH (other)-[:HAS_STACK]->(os:Stack)-[r2]->(user)',
    'DELETE r1',
    'WITH r2, us, other',
    'MERGE (us)-[r3:APPROVED]->(other)',
    'RETURN type(r2) as otherToUserRel'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    // if both parties have approved, create a conversation node
    if(results[0].otherToUserRel === 'APPROVED'){
      
      var query2 = [
        'MATCH (user:User {userId:{userId}}), (other:User {userId:{otherId}})',
        'MERGE (user)-[:HAS_CONVERSATION]->(m:Conversation)<-[:HAS_CONVERSATION]-(other)',
        'SET m.connectDate = timestamp()',
        'RETURN null'
      ].join('\n');

      var params2 = {
        userId: data.userId,
        otherId: data.otherId
      };

      db.query(query2, params2, function (err, results2) {        
        callback(err, results2);
      });
    } else {
      callback(err, results);
    }

  });
};

exports.reject = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[r1:STACK_USER]->(other:User {userId:{otherId}})',
    'DELETE r1',
    'WITH us, other',
    'MERGE (us)-[:REJECTED]->(other)',
    'RETURN null'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    callback(err, results);
  });
};