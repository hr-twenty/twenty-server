/* global require, exports */
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:32sWAeLkd1sBjy9yeB0v@twenty.sb01.stations.graphenedb.com:24789');

/*--------User Methods-----------*/
exports.create = function (linkedInData, callback) {
  var query = [
    'MERGE (user:User {userId:{userId}, firstName:{firstName}, lastName:{lastName}, headline: {headline}, picture: {picture}, numConnections: {numConnections}})',
    'MERGE (location:Location {city:{locationCity}, country:{locationCountry}})',
    'MERGE (industry:Industry {name:{industryName}})',
    'MERGE (curPosition:Position {title:{curPositionTitle}})',
    'MERGE (curCompany:Company {name: {curCompanyName}})',
    'MERGE (companySize:CompanySize {size: {companySize}})',
    'MERGE (language:Language {name: {languageName}})',
    'MERGE (skill:Skill {skill: {skillName}})',
    'MERGE (school:School {name: {schoolName}})',
    'MERGE (user) -[:HAS_STACK]-> (:Stack)',
    'MERGE (user) -[:LIVES_IN]-> (location)',
    'MERGE (user) -[:WORKS_IN]-> (industry)',
    'MERGE (user) -[:ROLE_IS]-> (curPosition)',
    // 'FOREACH (prevPosition in prevPositions | MERGE (user) -[:ROLE_WAS]-> (prevPosition))',
    'MERGE (user) -[:WORKS_FOR {startDate: {curCompanyStartDate}, endDate: {curCompanyEndDate}}]-> (curCompany)',
    'MERGE (curCompany) -[:HAS_CO_SIZE]-> (companySize)',
    // 'FOREACH (prevCompany in prevCompanies | MERGE (user) -[:WORKED_FOR {workedForData}]-> (prevCompany))',
    'MERGE (user) -[:HAS_SKILL]-> (skill)',
    'MERGE (user) -[:PROFICIENCY {level: {languageProficiency}}]-> (language)',
    'MERGE (user) -[:ATTENDED {fieldOfStudy: {schoolFieldOfStudy}, startDate: {schoolStartDate},endDate: {schoolEndDate}}]-> (school)',
    'RETURN user, location, industry, curPosition, curCompany, companySize, language, skill, school'
  ].join('\n');

  var params = linkedInData;

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(err, results[0]);
  });
};

exports.get = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})',
    'OPTIONAL MATCH (user)-[rel]->(other)',
    'RETURN user, type(rel), other'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(err, results);
  });
};

exports.save = function (callback) {
  this._node.save(function (err) {
    callback(err);
  });
};

exports.del = function (callback) {
  // use a Cypher query to delete both this user and all of his relationships
  var query = [
    'MATCH (user:User {userId})',
    'DELETE user',
    'WITH user',
    'MATCH OPTIONAL (user) -[rel]- (other)',
    'DELETE rel',
  ].join('\n');

  var params = {
    userId: this.id
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};

/*--------Interaction Methods-----------*/
exports.getUserStack = function (data, callback) {
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

exports.reject = function (data, other, callback) {
  var query = [
    'MATCH (user:User {userId}), (other:User {otherId})',
    'MERGE (user)-[r:REJECTS]->(other)',
    'RETURN user, type(r), other'
  ];

  var params = {
    userId: data.userId,
    otherId: other.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(err, results);
  });
};


exports.getAllConversations = function(data, callback){
  var query = [
    'MATCH (user:User {userId:{userId}})--(c:Conversation)--(other:User)',
    'OPTIONAL MATCH (c)-[:CONTAINS_MESSAGE]->(m:Message)',
    'RETURN user, other, m'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
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
    callback(err, results);
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

// // calls callback w/ (err, following, others) where following is an array of
// // users this user follows, and others is all other users minus him/herself.
// User.prototype.getFollowingAndOthers = function (callback) {
//     // query all users and whether we follow each one or not:
//     var query = [
//         'MATCH (user:User), (other:User)',
//         'OPTIONAL MATCH (user) -[rel:follows]-> (other)',
//         'WHERE ID(user) = {userId}',
//         'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
//     ].join('\n')

//     var params = {
//         userId: this.id,
//     };

//     var user = this;
//     db.query(query, params, function (err, results) {
//         if (err) return callback(err);

//         var following = [];
//         var others = [];

//         for (var i = 0; i < results.length; i++) {
//             var other = new User(results[i]['other']);
//             var follows = results[i]['COUNT(rel)'];

//             if (user.id === other.id) {
//                 continue;
//             } else if (follows) {
//                 following.push(other);
//             } else {
//                 others.push(other);
//             }
//         }

//         callback(null, following, others);
//     });
// };