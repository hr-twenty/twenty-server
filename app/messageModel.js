/* global require, exports */
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

/*--------Conversation Methods-----------*/
exports.getAllConversations = function(data, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User)',
    'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
    'RETURN other, collect(m) as messages'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    // var finalResults = results.map(function(obj){
    //   return {
    //     sender:obj.m.data.sender,
    //     text:obj.m.data.text,
    //     time:obj.m.data.time
    //   };
    // });
    callback(err, results);
  });
};

exports.getOneConversation = function(data, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User {userId:{otherId}})',
    'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
    'RETURN m'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      return {
        sender:obj.m.data.sender,
        text:obj.m.data.text,
        time:obj.m.data.time
      };
    });
    callback(err, finalResults);
  });
};

exports.sendMessage = function(data, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})-->(c:Conversation)<--(other:User {userId:{otherId}})',
    'MERGE (c)-[:CONTAINS_MESSAGE]->(m:Message {sender:{userId}, text:{text}, time:{time}})',
    'RETURN m'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId,
    text: data.text,
    time: data.time
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(err, results);
  });
};