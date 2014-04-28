/* global require, exports */
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

/*--------Stack Methods-----------*/
exports.getStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[:STACK_USER]->(other:User)',
    'OPTIONAL MATCH (other)-[:HAS_STACK]->(:Stack)-[r1:STACK_USER]->(user)',
    'OPTIONAL MATCH (other)-[r2]->(otherInfo)',
    'WHERE type(r2) <> "HAS_CONVERSATION"',
    'AND type(r2) <> "HAS_STACK"',
    'RETURN other, collect(type(r2)) as relationships, collect(otherInfo) as otherNodeData, r1.approved as approved',
    'ORDER BY r1.approved'
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
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User)-[:HAS_STACK]->(os:Stack)',
    'OPTIONAL MATCH (os)-[su:STACK_USER]->(user)',
    'WHERE user.userId <> other.userId',
    'AND NOT (user)-[:HAS_STACK]->(us:Stack)-[:STACK_USER]->(other)',
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
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(:Stack)-[su:STACK_USER]->(other:User {userId:{otherId}})',
    'OPTIONAL MATCH (other)-[:HAS_STACK]->(:Stack)-[so:STACK_USER]->(user)',
    'SET su.approved = true',
    'RETURN user, other, su.approved, so.approved'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);

    //if both parties have approved, create a conversation node
    if(results[0]['su.approved'] === true && results[0]['so.approved'] === true){
      
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
        if (err) return callback(err);
        callback(err, results2);
      });
    }

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
    if (err) return callback(err);
    callback(err, results);
  });
};