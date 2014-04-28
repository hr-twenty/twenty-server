/* global require, exports */
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

/*--------Stack Methods-----------*/
exports.getStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack)-[:STACK_USER]->(other:User)',
    'WHERE user.userId <> other.userId',
    'OPTIONAL MATCH (other)-[r1:HAS_STACK]->(os:Stack)-[r2:STACK_USER]->(user)',
    'RETURN user, us, other, os, count(r2)',
    'ORDER BY count(r2) DESC',
    'LIMIT 10'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(null, results);
  });

  moarStack(data);
};

//Utility function to add more users to your the Stack
var moarStack = function(data){
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User)-[:HAS_STACK]->(os:Stack)',
    'WHERE user.userId <> other.userId AND NOT (user)-[:HAS_STACK]->(us:Stack)-[:STACK_USER]->(other)',
    'MERGE (us)-[rel:STACK_USER]->(other)',
    'MERGE (os)-[:STACK_USER]->(user)',
    'RETURN count(rel)'
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
        'RETURN user, other, m'
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
    'RETURN user, other, su.rejected'
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