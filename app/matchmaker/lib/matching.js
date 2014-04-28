module.exports = function(db){
  return function(id, callback){
    var query = [
      'MATCH (user:User {userId})-->(source:Cluster)<--(peer:User)',
      'MATCH peer-->(:STACK)-[:APRROVES]->other-->(target:Cluster)<--(other:User)',
      'WHERE user.location = other.location AND NOT user-->(:STACK)-[:APRROVES]->other'
      'RETURN DISTINCT other.id'
    ].join(' ');

    var params = {
      userId: id
    };

    db.query(query, params, callback);
  };
};