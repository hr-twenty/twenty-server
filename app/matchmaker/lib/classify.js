module.exports = function(db){
  return function(id, callback){
    var query = [
      'MATCH (user:User {userId})-->(:Skill)<--(peer:User)-->(cluster:Cluster)',
      'RETURN DISTINCT cluster'
    ].join(' ');

    var params = {
      userId: id
    };

    db.query(query, params, callback);
  };
};