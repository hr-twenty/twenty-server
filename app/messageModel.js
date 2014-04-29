/* global require, exports */
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

/*--------Conversation Methods-----------*/
exports.getAllConversations = function(data, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User),',
    '(other)-[:WORKS_FOR]->(company:Company)',
    'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
    'RETURN other, collect(m) as messages, c.connectDate as connectDate, company'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      obj.user = params.userId;
      obj.other = {
        userId: obj.other.data.userId,
        firstName: obj.other.data.firstName,
        lastName: obj.other.data.lastName,
        picture: obj.other.data.picture,
        company: obj.company.data.name
      };
      obj.connectDate = obj.connectDate;
      obj.messages = obj.messages.map(function(obj2){
        return {
          sender:obj2.data.sender,
          text:obj2.data.text,
          time:obj2.data.time
        };
      });
      delete obj.company;
      return obj;
    });
    callback(err, finalResults);
  });
};

exports.getOneConversation = function(data, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User {userId:{otherId}})',
    'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
    'RETURN other, c.connectDate as connectDate, collect(m) as messages'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      obj.user = params.userId;
      obj.other = {
        userId: obj.other.data.userId,
        firstName: obj.other.data.firstName,
        lastName: obj.other.data.lastName,
        picture: obj.other.data.picture
      };
      obj.connectDate = obj.connectDate;
      obj.messages = obj.messages.map(function(obj2){
        return {
          sender:obj2.data.sender,
          text:obj2.data.text,
          time:obj2.data.time
        };
      });
      return obj;
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