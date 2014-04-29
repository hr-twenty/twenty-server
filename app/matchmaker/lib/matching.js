/* global module */
module.exports = function(db){
  return function(userId, callback){
    var query = [
      //users in my own cluster
      'MATCH (user:User {userId:{userId}})-->(source:Cluster)<--(other:User)',
      'WHERE (user)-->(:Location)<--(other)',
      'RETURN DISTINCT other.userId',
      'UNION',
      //users in my cluster-mates's preferred cluster
      'MATCH (user:User {userId:{userId})-->(source:Cluster)<--(peer:User),',
      '(peer)-->(:Stack)-[:APRROVES]->other-->(target:Cluster)<--(other:User)',
      'WHERE (user)-->(:Location)<--(other) AND NOT (user)-->(:Stack)-->(other)',
      'RETURN DISTINCT other.userId',
    ].join(' ');

    var params = {
      userId: userId
    };

    db.query(query, params, callback);

  };
};