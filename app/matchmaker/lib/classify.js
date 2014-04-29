/* global module, db */
var match = function(id, callback){
  var query = [
    'MATCH (user:User {userId: "{userId}"})-->(:Skill)<--(peer:User)-->(cluster:Cluster)',
    'RETURN cluster.id, count(peer) ORDER BY count(peer) DESC'
  ].join(' ');

  var params = {
    userId: id
  };

  db.query(query, params, callback);
};

var create = function(id, callback){
  var query = [
    'MATCH (user:User {userId: "{userId}"})',
    'CREATE (cluster:Cluster), (user)-[:BELONGS_TO]->(cluster)',
    'RETURN cluster.clusterIndex'
  ].join(' ');

  var params = {
    userId: id
  };

  db.query(query, params, callback);
};

module.exports = function(db){
  return function(id, callback){
    //find profiles sharing skills with user
    //and examine their clusters
    //pick one to put user in
    match(id, function(results){
      if (results.length === 0){
        create(id, function(id){
          callback(id);
        });
      } else {
        callback(results[0][0]);
      }
    });

    return this;
  };
};