/* global require, exports */
var db = require('../../../config/neo4j'),
    queryHelpers = require('../queryHelpers'),
    matchMaker = require('../../matchmaker/matchmaker')();

/*--------User Methods-----------*/
exports.create = function (linkedInData, callback) {

  dataChecker(linkedInData, function(missingData){
    if(missingData){return callback('Userdata is missing '+ missingData);}
  });

  var query = [
    'MERGE (user:User {userId:{userId}, firstName:{firstName}, lastName:{lastName}, headline: {headline}, picture: {picture}, numConnections: {numConnections}})',
    'MERGE (user)-[:HAS_STACK]->(:Stack)',
    'WITH user',
    'SET user.lastActive = "'+new Date().getTime()+'"',
    'WITH user',
    'MERGE (location:Location {city:{locationCity}, country:{locationCountry}})',
    'CREATE UNIQUE (user)-[:LIVES_IN]->(location)',
    'WITH user',
    'MERGE (industry:Industry {name:{industryName}})',
    'CREATE UNIQUE (user)-[:WORKS_IN]->(industry)',
    'WITH user',
    // Create all necessary position and company queries
    queryHelpers.positionQuery(linkedInData),
    // Create all necessary language queries
    queryHelpers.languageQuery(linkedInData),
    // Create all necessary skill queries
    queryHelpers.skillQuery(linkedInData),
    // Create all necessary school queries
    queryHelpers.schoolQuery(linkedInData),
    // Find and return all relationships we just created for this user
    'MATCH (user)-[r]->(otherNode)',
    'WHERE type(r) <> "HAS_STACK"',
    'AND type(r) <> "BELONGS_TO"',
    'AND type(r) <> "HAS_CONVERSATION"',
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
      //send results back to the front end
      processResults(results, callback);
      //add the user to the appropriate cluster
      matchMaker.classify(linkedInData.id, function(){});
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

exports.del = function (data, callback) {
  // use a Cypher query to delete both this user and all of his relationships
  var query = [
    'MATCH (user:User {userId:{userId}})-[r]-()',
    'DELETE user,r',
    'WITH user',
    'MATCH (user)-[a:HAS_STACK]->(stack:Stack)',
    'DELETE stack'
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

//Confirm that all the necessary components are in LinkedInData
var dataChecker = function(linkedInData, callback){
  if(!linkedInData.id){callback('id');}
  if(!linkedInData.firstName){callback('firstName');}
  if(!linkedInData.lastName){callback('lastName');}
  if(!linkedInData.headline){callback('headline');}
  if(!linkedInData.pictureUrl){callback('pictureUrl');}
  if(!linkedInData.numConnections){callback('numConnections');}
  if(!linkedInData.location){callback('location');}
  if(!linkedInData.location.name){callback('location.name');}
  if(!linkedInData.location.country.code){callback('location.country');}
  if(!linkedInData.industry){callback('industry');}
};

//THIS FEATURE IS NOT MVP
//template for update data
//var data = {userId:'3', previous:[{"WORKS_AT":{name:'Twitter'}}], current:[{"WORKED_AT":{name:'Twitter'},{"WORKS_AT":{name:'Google'}}]
exports.update = function (data, callback) {
  // var userId = data.userId;
  // var query = 'MATCH (user:User {userId:"'+userId+'"}) '+
  //   'WITH user ';

  // //remove/delete the previous values
  // for(var key in data.previous){
  //   if(['firstName', 'lastName', 'headline', 'picture', 'numConnections'].indexOf(key) !== -1){
  //     query += 'REMOVE user.'+key+' '+
  //       'WITH user ';
  //   } else {
  //     for(var key2 in data.previous.key){
  //       query += 'MATCH (user)-[r'+key+']->(other {'+key2+':'+data.previous[key][key2]+'}) '+
  //         'DELETE r '+
  //         'WITH user ';
  //     });
  //   }
  // }

  // //update/create the new values
  // for(var key3 in data.current){
  //   if(['firstName', 'lastName', 'headline', 'picture', 'numConnections'].indexOf(key3) !== -1){
  //     query += 'SET user.'+key3+' = '+data.current.key3+' '+
  //       'WITH user ';
  //   } else {
  //     for(var key4 in data.current.key3){
  //       query += 'MATCH (other {'+key4+':'+data.current[key4]+'}) '+
  //         'CREATE UNIQUE (user)-[:'+key3+']->(other) '+
  //         'WITH user ';
  //     }
  //   }
  // }

  // db.query(query, null, function (err) {
  //   callback(err);
  // });
};
