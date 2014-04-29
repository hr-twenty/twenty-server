module.exports = function(db){
  return function(id, callback){
    var query = [
      //users in my own cluster
      'MATCH (user:User {userId:"{userId}"})-->(source:Cluster)<--(other:User)',
      'WHERE (user)-->(:Location)<--(other)',
      'RETURN DISTINCT other.userId',
      'UNION',
      //users in my cluster-mates's preferred cluster
      'MATCH (user:User {userId: "{userId}")-->(source:Cluster)<--(peer:User), ',
      '(peer)-->(:Stack)-[:APRROVES]->other-->(target:Cluster)<--(other:User)',
      'WHERE (user)-->(:Location)<--(other) AND NOT (user)-->(:Stack)-->(other)',
      'RETURN DISTINCT other.userId',
    ].join(' ');

    var params = {
      userId: id
    };

    db.query(query, params, callback);

    return this;
  };
};