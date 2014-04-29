/* global require, exports */
var db = require('./db');
var matchMaker = require('./matchmaker/matchmaker')();

/*--------Stack Methods-----------*/
exports.getStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(:Stack)-[:STACK_USER]->(other:User)-[:HAS_STACK]->(os:Stack)-[r1:STACK_USER]->(user)',
    'OPTIONAL MATCH (os)-[r2:APPROVES]->(otherInfo)',
    'OPTIONAL MATCH (other)-[r3]->(otherInfo)',
    'WHERE type(r3) <> "HAS_CONVERSATION"',
    'AND type(r3) <> "HAS_STACK"',
    'RETURN other, collect(type(r2)) as relationships, collect(otherInfo) as otherNodeData, r2',
    'ORDER BY r2 DESC'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      var updatedObj = {};
      updatedObj.approved = obj.approved;
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
    callback(null, finalResults);
  });

  moarStack(data);
};

//Add more users to this user's Stack
var moarStack = function(data){

  // matchMaker.matches(data.userId, function(results2){
    
  // })

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

exports.approve = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[r1:STACK_USER]->(other:User {userId:{otherId}})',
    'OPTIONAL MATCH (other)-[:HAS_STACK]->(:Stack)-[r2:STACK_USER]->(user)',
    'DELETE r1',
    'WITH us, other',
    'MERGE (us)-[r3:APPROVES]->(other)',
    'RETURN type(r2), type(r3)'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
console.log(results)
    //if both parties have approved, create a conversation node
    // if(results[0]['su.approved'] === true && results[0]['so.approved'] === true){
      
    //   var query2 = [
    //     'MATCH (user:User {userId:{userId}}), (other:User {userId:{otherId}})',
    //     'MERGE (user)-[:HAS_CONVERSATION]->(m:Conversation)<-[:HAS_CONVERSATION]-(other)',
    //     'SET m.connectDate = timestamp()',
    //     'RETURN null'
    //   ].join('\n');

    //   var params2 = {
    //     userId: data.userId,
    //     otherId: data.otherId
    //   };

    //   db.query(query2, params2, function (err, results2) {        
        callback(err, results);
      // });
    // }

  });
};

exports.reject = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(:Stack)-[su:STACK_USER]->(other:User {userId:{otherId}})',
    'SET su.rejected = true',
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