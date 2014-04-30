/* global module */
module.exports = function(db){
  return function(userId, callback){
    var query = [
      //users in my own cluster
      'MATCH (user:User {userId:{userId}})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(other:User)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(other)',
      'RETURN DISTINCT other.userId',
      'UNION',
      //users in my cluster-mates's preferred cluster
      'MATCH (user:User {userId:{userId})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(peer:User),',
      '(peer)-->(:Stack)-[:APRROVED]->(other:User)-[:BELONGS_TO]->(target:Cluster)',
      'WITH user, target',
      'MATCH (target)<-[:BELONGS_TO]-(other2:User)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(other2)',
      'AND NOT (user)-[:HAS_STACK]->(:Stack)-[:APRROVED]->(other2)',
      'AND NOT (user)-[:HAS_STACK]->(:Stack)-[:REJECTED]->(other2)',
      'RETURN DISTINCT other2.userId',
    ].join(' ');

    var params = {
      userId: userId
    };

    db.query(query, params, callback);

  };
};