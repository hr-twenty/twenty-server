module.exports = function(db){
  return function(id, callback){
    //find profiles sharing skills with user
    //and examine their clusters
    //pick one to put user in
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