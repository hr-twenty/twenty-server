/* global module */
var match = function(db, userId, callback){
  //find the cluster this user should be associated with
  var query = [
    'MATCH (user:User {userId:{userId}})-[:HAS_SKILL]->(:Skill)',
    '<-[:HAS_SKILL]-(peer:User)-[:BELONGS_TO]->(cluster:Cluster)',
    'RETURN cluster.clusterIndex, count(peer) ORDER BY count(peer) DESC'
  ].join(' \n');

  var params = {
    userId: userId
  };

  db.query(query, params, callback);
};

var create = function(db, userId, callback){
  //create a new cluster this user should be associated with
  var query = [
    'MERGE (user:User {userId:{userId}})',
    'CREATE UNIQUE (user)-[:BELONGS_TO]->(cluster:Cluster)',
    'RETURN cluster.clusterIndex'
  ].join('\n');

  var params = {
    userId: userId
  };

  db.query(query, params, callback);
};

var createRelation = function(userId, clusterIndex, callback){
  var query = [
    'MATCH (user:User {userId: "{userId}"})',
    ', (cluster:Cluster {clusterIndex: "{clusterIndex}"})',
    'MERGE (user)-[:BELONGS_TO]->(cluster)',
    'RETURN cluster.clusterIndex'
  ].join(' ');

  var params = {
    userId: userId
    clusterIndex: clusterIndex
  };

  db.query(query, params, callback);
}


module.exports = function(db){
  return function(userId, callback){
    match(db, userId, function(err, results){
      if (results.length === 0){
        createCluster(db, id, callback(id))
      } else {
        createRelation(id, results[0][0], callback)
      }
    });

    return this;
  };
};