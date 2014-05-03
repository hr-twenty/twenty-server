/* global module */
module.exports = function(db){
  return function(userId, callback){
    var query = [
      //find out who users in my cluster have approved and find their cluster
      'MATCH (user:User {userId:{userId}})-[:BELONGS_TO]->(source:Cluster)<-[:BELONGS_TO]-(peer:User)-[:HAS_STACK]->(:Stack)-[:APRROVED]->(other:User)-[:BELONGS_TO]->(target:Cluster)',
      'WHERE user.userId <> peer.userId',
      'AND user.userId <> other.userId',
      'AND peer.userId <> other.userId',
      'AND id(source) <> id(target)',
      'WITH user, target',
      'LIMIT 5',
      //find the users on the target cluster that aren't already on my stack and add them
      'MATCH (target)<-[:BELONGS_TO]-(targetOther:User), (user)-[:HAS_STACK]->(us:Stack), (targetOther:User)-[:HAS_STACK]->(os:Stack)',
      'WHERE (user)-[:LIVES_IN]->(:Location)<-[:LIVES_IN]-(targetOther)',
      'AND NOT (us)-->(targetOther)',
      'CREATE UNIQUE (us)-[:STACK_USER]->(targetOther)',
      'CREATE UNIQUE (os)-[:STACK_USER]->(user)',
      'WITH targetOther',
      'LIMIT 10',
      //find the information about the targetOther user to return to the front end
      'MATCH (targetOther)-[r3]->(otherInfo)',
      'WHERE type(r3) <> "HAS_CONVERSATION"',
      'AND type(r3) <> "HAS_STACK"',
      'AND type(r3) <> "BELONGS_TO"',
      'RETURN targetOther, collect(type(r3)) as relationships, collect(otherInfo) as otherNodeData'
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
        'CREATE UNIQUE (us)-[:STACK_USER]->(other)',
        'CREATE UNIQUE (os)-[:STACK_USER]->(user)',
        'WITH other',
        'LIMIT 10',
        'MATCH (other)-[r3]->(otherInfo)',
        'WHERE type(r3) <> "HAS_CONVERSATION"',
        'AND type(r3) <> "HAS_STACK"',
        'AND type(r3) <> "BELONGS_TO"',
        'RETURN other, collect(type(r3)) as relationships, collect(otherInfo) as otherNodeData'
      ].join('\n');

      var params = {
        userId: userId
      };

      db.query(query, params, function(err, randomResults){
        if (err) return callback(err);
        var finalResults = [];
        finalResults=finalResults.concat(results);
        finalResults=finalResults.concat(randomResults);
        callback(err, finalResults);
      });
    });
  };
};
