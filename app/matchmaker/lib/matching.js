/* global module */
module.exports = function(db){
  return function(userId, callback){
    var query = [
      //users in my own cluster
      'MATCH (user:User {userId:{userId}})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(other:User)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(other)',
      'RETURN DISTINCT collect(other.userId) as otherId',
      'UNION',
      //users in my cluster-mates's preferred cluster
      'MATCH (user:User {userId:{userId}})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(peer:User),',
      '(peer)-->(:Stack)-[:APRROVED]->(other:User)-[:BELONGS_TO]->(target:Cluster)',
      'WITH user, target',
      'MATCH (target)<-[:BELONGS_TO]-(other2:User)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(other2)',
      'AND NOT (user)-[:HAS_STACK]->(:Stack)-[:APRROVED]->(other2)',
      'AND NOT (user)-[:HAS_STACK]->(:Stack)-[:REJECTED]->(other2)',
      'RETURN DISTINCT collect(other2.userId) as otherId',
      'LIMIT 30'
    ].join('\n');

    var params = {
      userId: userId
    };

    db.query(query, params, function(err, results){
      if (err) return callback(err);

      var query = [
        'MATCH (user:User {userId:{userId}})-[:HAS_STACK]->(us:Stack), (other:User)-[:HAS_STACK]->(os:Stack)',
        'WHERE user.userId <> other.userId',
        'AND NOT (us)-->(other)',
        'RETURN DISTINCT collect(other.userId) as otherId',
        'LIMIT 10'
      ].join('\n');

      var params = {
        userId: userId
      };

      db.query(query, params, function(err, randomResults){
        if (err) return callback(err);
        var finalResults = results[0].otherId.concat(results[1].otherId).concat(randomResults[0].otherId);
        callback(null, finalResults);
      });
    });
  };
};
