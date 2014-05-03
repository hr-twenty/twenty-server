/* global require, exports */
var db = require('../../../config/neo4j');

exports.getAll = function(cb) {
  cb(null, {});
};

exports.create = function(message, cb) {
  cb(null, {});
};

exports.getById = function(params, cb) {
  cb(null, {});
};

exports.update = function(params, message, cb) {
  cb(null, {});
};

exports.remove = function(params, cb) {
  cb(null, {});
};

// /*--------Conversation Methods-----------*/
// exports.getAllConversations = function(data, callback){
//   var query = [
//     'MATCH (user:User {userId:{userId}})',
//     'SET user.lastActive = '+ new Date().getTime(),
//     'WITH user',
//     'MATCH (user)--(c:Conversation)--(other:User),',
//     '(other)-[:WORKS_FOR]->(company:Company)',
//     'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
//     'RETURN other, collect(m) as messages, c.connectDate as connectDate, company',
//     'ORDER BY m.time'
//   ].join('\n');
//
//   var params = {
//     userId: data.userId
//   };
//
//   db.query(query, params, function (err, results) {
//     if (err){return callback(err);}
//     else {processMessages(data.userId, results, callback);}
//   });
// };
//
// exports.getOneConversation = function(data, callback){
//   var query = [
//     'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User {userId:{otherId}})',
//     'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
//     'WHERE m.time > {mostRecentMsg}',
//     'RETURN other, c.connectDate as connectDate, collect(m) as messages',
//     'ORDER BY m.time'
//   ].join('\n');
//
//   var params = {
//     userId: data.userId,
//     otherId: data.otherId,
//     mostRecentMsg: data.mostRecentMsg
//   };
//
//   db.query(query, params, function (err, results) {
//     if (err){return callback(err);}
//     else {processMessages(data.userId, results, callback);}
//   });
// };
//
// //Clean up the data from Neo4j before sending to the front end
// var processMessages = function(userId, results, callback){
//   var finalResults = results.map(function(obj){
//     obj.user = userId;
//     obj.other = {
//       userId: obj.other.data.userId,
//       firstName: obj.other.data.firstName,
//       lastName: obj.other.data.lastName,
//       picture: obj.other.data.picture,
//       lastActive: obj.other.data.lastActive,
//       company: obj.company.data.name
//     };
//     obj.connectDate = obj.connectDate;
//     obj.messages = obj.messages.map(function(obj2){
//       return {
//         sender:obj2.data.sender,
//         text:obj2.data.text,
//         time:obj2.data.time
//       };
//     });
//     delete obj.company;
//     return obj;
//   });
//   callback(null, finalResults);
// };
//
// exports.sendMessage = function(data, callback){
//   var query = [
//     'MATCH (user:User {userId:{userId}})-->(c:Conversation)<--(other:User {userId:{otherId}})',
//     'MERGE (c)-[:CONTAINS_MESSAGE]->(m:Message {sender:{userId}, text:{text}, time:{time}})',
//     'RETURN null'
//   ].join('\n');
//
//   var params = {
//     userId: data.userId,
//     otherId: data.otherId,
//     text: data.text,
//     time: data.time
//   };
//
//   db.query(query, params, function (err, results) {
//     callback(err, results);
//   });
// };
