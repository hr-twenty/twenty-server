module.exports = function(db){
  return function(id, callback){
    //find profiles sharing skills with user
    //and examine their clusters
    //pick one to put user in
    var query = [
      'MATCH (user:User {userId})-->(:Skill)<--(peer:User)-->(cluster:Cluster)',
      'RETURN cluster.id, count(peer) ORDER BY count(peer) DESC'
    ].join(' ');

    var params = {
      userId: id
    };

    db.query(query, params, function(results){
      callback(results[0][0]);
    });

    return this;
  };
};