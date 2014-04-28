module.exports = function(db){
  return function(id, callback){
    var query = [
      'MATCH (user:User {userId})-->(source:Cluster)<--(peer:User)',
      'MATCH peer-->(:Stack)-[:APRROVES]->other-->(target:Cluster)<--(other:User)',
      'WHERE user-->(:Location)<--other AND NOT user-->(:STACK)-[:APRROVES]->other',
      'RETURN DISTINCT other.id'
    ].join(' ');

    var params = {
      userId: id
    };

    db.query(query, params, callback);
  };
};