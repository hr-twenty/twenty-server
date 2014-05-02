/* global module */
var match = function(db, userId, callback){
  //find the cluster this user should be associated with
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_SKILL]->(:Skill)',
    '<-[:HAS_SKILL]-(peer:User)-[:BELONGS_TO]->(cluster:Cluster)',
    'RETURN id(cluster) as clusterId, count(peer) ORDER BY count(peer) DESC'
  ].join(' \n');

  var params = {
    userId: userId
  };

  db.query(query, params, callback);
};

var createCluster = function(db, userId, callback){
  //create a new cluster this user should be associated with
  var query = [
    'MATCH (user:User {userId:{userId}})',
    'CREATE UNIQUE (user)-[:BELONGS_TO]->(cluster:Cluster)',
    'RETURN null'
  ].join('\n');

  var params = {
    userId: userId
  };

  db.query(query, params, callback);
};

var createRelation = function(db, userId, clusterId, callback){
  var query = [
    'START cluster=node({clusterId})',
    'MATCH (user:User {userId:{userId}})',
    'CREATE UNIQUE (user)-[:BELONGS_TO]->(cluster)',
    'RETURN null'
  ].join(' ');

  var params = {
    userId: userId,
    clusterId: clusterId
  };

  db.query(query, params, callback);
};


module.exports = function(db){
  return function(userId, callback){
    match(db, userId, function(err, results){
      if (results.length === 0){
        console.log('create', results)
        createCluster(db, userId, callback);
      } else {
        console.log('rel', results)

        createRelation(db, userId, results[0]['clusterId'], callback);
      }
    });

    return this;
  };
};