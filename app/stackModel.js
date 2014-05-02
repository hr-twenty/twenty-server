/* global require, exports */
var db = require('./db');
var matchMaker = require('./matchmaker/matchmaker')();

/*--------Stack Methods-----------*/
exports.getStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(:Stack)-[:STACK_USER]',
    '->(other:User)-[:HAS_STACK]->(os:Stack)-[r2]->(user)',
    'WHERE type(r2) <> "REJECTED"',
    'AND user.userId <> other.userId',
    'WITH other, r2',
    // 'SKIP '+(data.skip || 0),
    'LIMIT 20',
    'MATCH (other)-[r3]->(otherInfo)',
    'WHERE type(r3) <> "HAS_CONVERSATION"',
    'AND type(r3) <> "HAS_STACK"',
    'AND type(r3) <> "STACK_USER"',
    'AND type(r3) <> "APPROVED"',
    'RETURN other, collect(type(r3)) as relationships, collect(otherInfo) as otherNodeData, type(r2) as otherToUserRel',
    'ORDER BY type(r2)'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);

    
    //if there aren't enough users on the stack, get more users from the cluster
    if(results.length < 10){
      matchMaker.matches(data.userId, function(err, results){
        addAllMatchesToStack(data.userId, results, callback);
      });
    } else {
    //otherwise, clean up the data and send it out
      processResults(results, callback);
    // }
  });
};

//Add the user to each other user in the array and vice versa 
var addAllMatchesToStack = function(userId, array, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User)-[:HAS_STACK]->(os:Stack)',
    'WHERE other.userId IN {results}',
    'CREATE UNIQUE (us)-[:STACK_USER]->(other)',
    'CREATE UNIQUE (os)-[:STACK_USER]->(user)',
    'WITH other, os',
    'LIMIT 40',
    'MATCH (other)-[r3]->(otherInfo)',
    'WHERE type(r3) <> "HAS_CONVERSATION"',
    'AND type(r3) <> "HAS_STACK"',
    'AND type(r3) <> "STACK_USER"',
    'AND type(r3) <> "APPROVED"',
    'AND type(r3) <> "REJECTED"',
    'RETURN other, collect(type(r3)) as relationships, collect(otherInfo) as otherNodeData'
  ].join('\n');

  var params = {
    userId: userId,
    results: array
  };

  db.query(query, params, function (err, results) {
    if (err){return callback(err);}
    else {processResults(results, callback);}
  });
};

//Clean up the data from Neo4j before sending to the front end
var processResults = function(results, callback){
  var finalResults = results.map(function(obj){
    var updatedObj = {};
    updatedObj.otherToUserRel = obj.otherToUserRel || 'STACK_USER';
    //get user data and put it directly on the object
    for(var key in obj.other.data){
      updatedObj[key] = obj.other.data[key];
    }
    //for each relationship, create a key of the relationship type and a value of that relationship's data
    for(var i = 0; i < obj.relationships.length; i++){
      if(updatedObj[obj.relationships[i]]){
        updatedObj[obj.relationships[i]].push(obj.otherNodeData[i].data);
      } else {
        updatedObj[obj.relationships[i]] = [obj.otherNodeData[i].data];
      }
    }
    return updatedObj;
  });
  callback(null, finalResults);
};

/*--------User Interaction with Stack Methods-----------*/
exports.approve = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[r1]->(other:User {userId:{otherId}})',
    'DELETE r1',
    'WITH us, other',
    'MERGE (us)-[r3:APPROVED]->(other)',
    'OPTIONAL MATCH (other)-[:HAS_STACK]->(os:Stack)-[r2]->(user)',
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
    //otherwise, send back the results
      callback(err, results);
    }

  });
};

exports.reject = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[r1]->(other:User {userId:{otherId}})',
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

//reset all of the relationships I've created with other users on my stack
exports.resetStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[r1]->(other:User)',
    'DELETE r1',
    'WITH us, other',
    'MERGE (us)-[:STACK_USER]->(other)',
    'RETURN null'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    callback(err, results);
  });
};
