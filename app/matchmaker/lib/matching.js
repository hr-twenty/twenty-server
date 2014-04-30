/* global module */
module.exports = function(db){
  return function(userId, callback){
    var query = [
      //users in my own cluster
      'MATCH (user:User {userId:{userId}})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(other:User)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(other)',
      'RETURN DISTINCT other.userId as userId',
      'UNION',
      //users in my cluster-mates's preferred cluster
      'MATCH (user:User {userId:{userId}})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(peer:User),',
      '(peer)-->(:Stack)-[:APRROVED]->(other:User)-[:BELONGS_TO]->(target:Cluster)',
      'WITH user, target',
      'MATCH (target)<-[:BELONGS_TO]-(other2:User)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(other2)',
      'AND NOT (user)-[:HAS_STACK]->(:Stack)-[:APRROVED]->(other2)',
      'AND NOT (user)-[:HAS_STACK]->(:Stack)-[:REJECTED]->(other2)',
      'RETURN DISTINCT other2.userId as userId'
    ].join(' ');

    var params = {
      userId: userId
    };

    db.query(query, params, function(err, results){
      if (err) return callback(err);

      var random = Math.max(30, results.length)

      var query = [
        'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User)-[:HAS_STACK]->(os:Stack)',
        'WHERE user.userId <> other.userId',
        'AND NOT (us)-->(other)',
        'RETURN DISTINCT other.userId as userId LIMIT {limit}'
      ].join(' ');

      var params = {
        userId: userId,
        limit: Math.max(30, results.length)
      };

      db.query(query, params, function(err, randomResults){
        if (err) return callback(err);
        callback(null, results.concat(randomResults));
      })
    });
  };
};