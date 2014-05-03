/* global require, exports */
var db = require('./db');
var matchMaker = require('./matchmaker/matchmaker')();

/*--------Stack Methods-----------*/
exports.getStack = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(:Stack)-[:STACK_USER]->(other:User)-[:HAS_STACK]->(os:Stack)-[r2]->(user)',
    'WHERE type(r2) <> "REJECTED"',
    'WITH other, r2',
    'LIMIT 20',
    'MATCH (other)-[r3]->(otherInfo)',
    'WHERE type(r3) <> "HAS_CONVERSATION"',
    'AND type(r3) <> "HAS_STACK"',
    'AND type(r3) <> "BELONGS_TO"',
    'RETURN DISTINCT other, collect(type(r3)) as relationships, collect(otherInfo) as otherNodeData, type(r2) as otherToUserRel',
    'ORDER BY type(r2)'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    //if there aren't enough users on the stack, get more users from the cluster
    if(results.length < 10){
      matchMaker.matches(data.userId, function(err,results){
        processResults(results,callback);
      });
    } else {
    //otherwise, clean up the data and send it out
      processResults(results, callback);
    }
  });
};

//Clean up the data from Neo4j before sending to the front end
var processResults = function(results, callback){
  var finalResults = results.map(function(obj){
    var updatedObj = {};
    updatedObj.otherToUserRel = (obj.otherToUserRel || 'STACK_USER');
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
    'MATCH (user:User)-[:HAS_STACK]->(us:Stack)-[r1]->(other:User {userId:{otherId}})',
    'DELETE r1',
    'WITH us, other, user',
    'MATCH (other)-[:HAS_STACK]->(os:Stack)-[r2]->(user)',
    'CREATE UNIQUE (us)-[:APPROVED]->(other)',
    'RETURN type(r2) as otherToUserRel'
  ].join('\n');

  var params = {
    userId: data.userId,
    otherId: data.otherId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    // if both parties have approved, create a conversation node
    console.log('approved!', results)
    if(results[2].otherToUserRel === 'APPROVED'){
      var query2 = [
        'MATCH (user:User {userId:{userId}}), (other:User {userId:{otherId}})',
        'CREATE UNIQUE (user)-[:HAS_CONVERSATION]->(c:Conversation)<-[:HAS_CONVERSATION]-(other)',
        'WITH c',
        'MERGE (c)-[:CONTAINS_MESSAGE]->(m:Message)',
        'ON CREATE SET m.system = true',
        'ON CREATE SET c.connectDate = "'+ new Date().getTime()+'"',
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
    'CREATE UNIQUE (us)-[:REJECTED]->(other)',
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
    'CREATE UNIQUE (us)-[:STACK_USER]->(other)',
    'RETURN null'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    callback(err, results);
  });
};
