/* global require, exports */
var db = require('./db');
var matchMaker = require('./matchmaker/matchmaker')();

/*--------User Methods-----------*/
exports.create = function (linkedInData, callback) {
  var query = [
    'MERGE (user:User {userId:{userId}, firstName:{firstName}, lastName:{lastName}, headline: {headline}, picture: {picture}, numConnections: {numConnections}})',
    'CREATE UNIQUE (user) -[:HAS_STACK]-> (:Stack)',
    'WITH user',
    'MERGE (location:Location {city:{locationCity}, country:{locationCountry}})',
    'CREATE UNIQUE (user) -[:LIVES_IN]-> (location)',
    'WITH user',
    'MERGE (industry:Industry {name:{industryName}})',
    'CREATE UNIQUE (user) -[:WORKS_IN]-> (industry)',
    'WITH user',
    // Create all necessary position and company queries
    positionQuery(linkedInData),
    // Create all necessary language queries
    languageQuery(linkedInData),
    // Create all necessary skill queries
    skillQuery(linkedInData),
    // Create all necessary school queries
    schoolQuery(linkedInData),
    // Find and return all relationships we just created for this user
    'MATCH (user)-[r]->(otherNode)',
    'WHERE type(r) <> "HAS_STACK"',
    'AND type(r) <> "BELONGS_TO"',
    'RETURN user, collect(type(r)) as relationships, collect(otherNode) as otherNodeData'
  ].join('\n');

  var params = {
    userId: linkedInData.id,
    firstName: linkedInData.firstName,
    lastName: linkedInData.lastName,
    headline: linkedInData.headline,
    picture: linkedInData.pictureUrl,
    numConnections: linkedInData.numConnections,
    locationCity: linkedInData.location.name,
    locationCountry: linkedInData.location.country.code,
    industryName: linkedInData.industry
  };

  db.query(query, params, function (err, results) {
    if (err){return callback(err);}
    else {
      processResults(results, callback);
      // matchMaker.classify(linkedInData.userId, function(){});
    }
  });
};

exports.get = function (data, callback) {
  var query = [
    'MATCH (user:User {userId:{userId}})-[rel]->(other)',
    'WHERE type(rel) <> "HAS_STACK"',
    'AND type(rel) <> "HAS_CONVERSATION"',
    'RETURN user, collect(type(rel)) as relationships, collect(other) as otherNodeData'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err, results) {
    if (err){return callback(err);}
    else {processResults(results, callback);}
  });
};

exports.update = function (data, callback) {
  var userId = data.userId;
  delete data.userId;
  finalResult = '';
  for(var key in data){
    if(['firstName', 'lastName', 'headline', 'picture', 'numConnections'].indexOf(key) !== -1){

    } else {

    }
  };

  user.positions.values.forEach(function(p){
    finalResult += 'MERGE (position:Position {title:"'+p.title+'"}) '+
    'CREATE UNIQUE (user)-[:'+isCurrentPos(p)+']->(position) '+
    'WITH user '+
    'MERGE (company:Company {name:"'+p.company.name+'"}) '+
    'MERGE (companySize:CompanySize {size:"'+p.company.size+'"}) '+
    'CREATE UNIQUE (company) -[:HAS_CO_SIZE]-> (companySize) '+
    'CREATE UNIQUE (user) -[:'+isCurrentCo(p)+' {startDate:"'+p.startDate.month+'-'+p.startDate.year+'", endDate:"'+isCurrentDate(p)+'"}]-> (company) '+
    'WITH user ';
  });

  db.query(query, params, function (err) {
    callback(err);
  });
};

exports.del = function (data, callback) {
  // use a Cypher query to delete both this user and all of his relationships
  var query = [
    'MATCH (user:User {userId:{userId}})-[r]-()',
    'OPTIONAL MATCH (user)-[:HAS_STACK]->(stack:Stack)',
    'DELETE user,r, stack'
  ].join('\n');

  var params = {
    userId: data.userId
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};

//Clean up the data from Neo4j before sending to the front end
var processResults = function(results, callback){
  var finalResults = results.map(function(obj){
    var updatedObj = {};
    //get user data and put it directly on the object
    for(var key in obj.user.data){
      updatedObj[key] = obj.user.data[key];
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

/*--------Query Helper Methods-----------*/
var positionQuery = function(user){
  if(user.positions){
    var finalResult = '';
    var isCurrentPos = function(p){
      if(p.isCurrent){return 'ROLE_IS';} 
      else {return 'ROLE_WAS';}
    };
    var isCurrentCo = function(p){
      if(p.isCurrent){return 'WORKS_FOR';} 
      else {return 'WORKED_FOR';}
    };
    var isCurrentDate = function(p){
      if(p.isCurrent){return 'Present';}
      else {return p.endDate.month+'-'+p.endDate.year;}
    };
    user.positions.values.forEach(function(p){
      finalResult += 'MERGE (position:Position {title:"'+p.title+'"}) '+
      'CREATE UNIQUE (user)-[:'+isCurrentPos(p)+']->(position) '+
      'WITH user '+
      'MERGE (company:Company {name:"'+p.company.name+'"}) '+
      'MERGE (companySize:CompanySize {size:"'+p.company.size+'"}) '+
      'CREATE UNIQUE (company) -[:HAS_CO_SIZE]-> (companySize) '+
      'CREATE UNIQUE (user) -[:'+isCurrentCo(p)+' {startDate:"'+p.startDate.month+'-'+p.startDate.year+'", endDate:"'+isCurrentDate(p)+'"}]-> (company) '+
      'WITH user ';
    });
    return finalResult;
  }
};

var languageQuery = function(user){
  if(user.languages){
    var finalResult = '';
    user.languages.values.forEach(function(l){
      finalResult += 'MERGE (language:Language {name:"'+l.language.name+'"}) '+
      'CREATE UNIQUE (user) -[:SPEAKS]-> (language) '+
      'WITH user ';
    });
    return finalResult;
  }
};

var skillQuery = function(user){
  if(user.skills){
    var finalResult = '';
    user.skills.values.forEach(function(s){
      finalResult += 'MERGE (skill:Skill {skill:"'+s.skill.name+'"}) '+
      'CREATE UNIQUE (user) -[:HAS_SKILL]-> (skill) '+
      'WITH user ';
    });
    return finalResult;
  }
};

var schoolQuery = function(user){
  var startYearOrNA = function(s){
    if(s.startDate){return s.startDate.year;}
    else {return 'Not Entered';}
  };
  var endYearOrNA = function(s){
    if(s.endDate){return s.endDate.year;}
    else {return 'Not Entered';}
  };
  if(user.educations){
    var finalResult = '';
    user.educations.values.forEach(function(s){
      finalResult += 'MERGE (school:School {name:"'+s.schoolName+'"}) '+
      'CREATE UNIQUE (user) -[:ATTENDED {fieldOfStudy:"'+(s.fieldOfStudy || '')+'", startDate:"'+startYearOrNA(s)+'",endDate:"'+endYearOrNA(s)+'"}]-> (school) '+
      'WITH user ';
    });
    return finalResult;
  }
};
