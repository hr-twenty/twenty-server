/* global require, exports */
var db = require('./db');
var matchMaker = require('./matchmaker/matchmaker')();

/*--------User Methods-----------*/
exports.create = function (linkedInData, callback) {
  var query = [
    'MERGE (user:User {userId:{userId}, firstName:{firstName}, lastName:{lastName}, headline: {headline}, picture: {picture}, numConnections: {numConnections}})',
    'MERGE (location:Location {city:{locationCity}, country:{locationCountry}})',
    'MERGE (industry:Industry {name:{industryName}})',
    'MERGE (curPosition:Position {title:{curPositionTitle}})',
    // 'MERGE (curPosition:Position {title:{curPositionTitle}})',
    'MERGE (curCompany:Company {name: {curCompanyName}})',
    // 'MERGE (curCompany:Company {name: {curCompanyName}})',
    'MERGE (companySize:CompanySize {size: {companySize}})',
    // 'MERGE (companySize:CompanySize {size: {companySize}})',
    'MERGE (language:Language {name: {languageName}})',
    // 'MERGE (language:Language {name: {languageName}})',
    // 'MERGE (skill:Skill {skill: {skillName}})',
    // 'MERGE (school:School {name: {schoolName}})',
    // [{endDate, schoolName, startDate]
    'CREATE UNIQUE (user) -[:HAS_STACK]-> (:Stack)',
    'CREATE UNIQUE (user) -[:LIVES_IN]-> (location)',
    'CREATE UNIQUE (user) -[:WORKS_IN]-> (industry)',
    'CREATE UNIQUE (user) -[:ROLE_IS]-> (curPosition)',
    // 'FOREACH (prevPosition in prevPositions | CREATE UNIQUE (user) -[:ROLE_WAS]-> (prevPosition))',
    'CREATE UNIQUE (user) -[:WORKS_FOR {startDate: {curCompanyStartDate}, endDate: {curCompanyEndDate}}]-> (curCompany)',
    // 'CREATE UNIQUE (user) -[:WORKS_FOR {startDate: {curCompanyStartDate}, endDate: {curCompanyEndDate}}]-> (curCompany)',
    'CREATE UNIQUE (curCompany) -[:HAS_CO_SIZE]-> (companySize)',
    // 'FOREACH (prevCompany in prevCompanies | CREATE UNIQUE (user) -[:WORKED_FOR {workedForData}]-> (prevCompany))',
    // 'CREATE UNIQUE (user) -[:HAS_SKILL]-> (skill)',
    'CREATE UNIQUE (user) -[:PROFICIENCY {level: {languageProficiency}}]-> (language)',
    // 'CREATE UNIQUE (user) -[:PROFICIENCY {level: {languageProficiency}}]-> (language)',
    'CREATE UNIQUE (user) -[:ATTENDED {fieldOfStudy: {schoolFieldOfStudy}, startDate: {schoolStartDate},endDate: {schoolEndDate}}]-> (school)',
    // 'CREATE UNIQUE (user) -[:ATTENDED {fieldOfStudy: {schoolFieldOfStudy}, startDate: {schoolStartDate},endDate: {schoolEndDate}}]-> (school)',
    'WITH (user)',
    'MATCH (user)-[r]->(otherNode)',
    'WHERE type(r) <> "HAS_STACK"',
    'AND type(r) <> "BELONGS_TO"',
    'RETURN user, collect(type(r)) as relationships, collect(otherNode) as otherNodeData'
  ].join('\n');

  var params = linkedInData;

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      var updatedObj = {};
      //get user data
      for(var key in obj.user.data){
        updatedObj[key] = obj.user.data[key];
      }
      //get all relationships
      for(var i = 0; i < obj.relationships.length; i++){
        updatedObj[obj.relationships[i]] = obj.otherNodeData[i].data;
      }
      return updatedObj;
    });
    matchMaker.classify(linkedInData.userId, function(){});
    callback(err, finalResults);
  });
};

exports.get = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[rel]->(other)',
    'WHERE type(rel) <> "HAS_STACK" AND type(rel) <> "HAS_CONVERSATION"',
    'RETURN user, collect(type(rel)) as relationships, collect(other) as otherNodeData'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var finalResults = results.map(function(obj){
      var updatedObj = {};
      //get user data
      for(var key in obj.user.data){
        updatedObj[key] = obj.user.data[key];
      }
      //get all relationships
      for(var i = 0; i < obj.relationships.length; i++){
        updatedObj[obj.relationships[i]] = obj.otherNodeData[i].data;
      }
      return updatedObj;
    });
    callback(err, finalResults);
  });
};

exports.update = function (data, callback) {
  
};

exports.del = function (data, callback) {
  // use a Cypher query to delete both this user and all of his relationships
  var query = [
    'MATCH (user:User {userId:{userId}})-[r]-()',
    'DELETE user,r'

    ////////DELETE USER STACK
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};