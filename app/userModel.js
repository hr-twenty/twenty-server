/* global require, module*/
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://twenty:r5JqrtqFkkK1AtzxkOyc@twenty.sb01.stations.graphenedb.com:24789');
var otherModels = require('./everyOtherModel');

// Private constructor:
// Used to ensure all nodes have access to user functions
var User = module.exports = function User(_node) {
  this._node = _node;
};

// Prototype methods:
User.prototype.save = function (callback) {
  this._node.save(function (err) {
    callback(err);
  });
};

User.prototype.del = function (callback) {
  // use a Cypher query to delete both this user and all of his relationships
  var query = [
    'MATCH (user:User)',
    'WHERE ID(user) = {userId}',
    'DELETE user',
    'WITH user',
    'MATCH OPTIONAL (user) -[rel]- (other)',
    'DELETE rel',
  ].join('\n')

  var params = {
    userId: this.id
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};

User.prototype.approve = function (other, callback) {
  this._node.createRelationshipTo(other._node, 'APPROVED', {}, function (err, rel) {
    callback(err);
  });
};

//NEED TO MAKE THIS WORK
User.prototype.getMessages = function(callback){
  var query = [
    'MATCH (user:User) -[rel:APPROVED]- (other:User)',
    'WHERE ID(user) = {userId}',
    'RETURN other, rel.startDate, rel.conversation'
  ].join('\n')

  var params = {
    userId: this.id
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(err, results);
  });
};

//NEED TO MAKE THIS WORK
User.prototype.sendMessage = function(other, callback){
  var query = [
    'MATCH (user:User) -[rel:APPROVED]- (other:User)',
    'WHERE ID(user) = {userId}',
    'RETURN other, rel.startDate, rel.conversation'
  ].join('\n')

  var params = {
    userId: this.id,
    otherId: other.id
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    callback(err, results);
  });
};

//NEED TO MAKE THIS WORK
//CREATE PENDING RELATIONSHIP ON ALL OTHERS
User.prototype.getUserStack = function (query, callback) {
  var query = [
    'MATCH (user:User), (other:User)',
    'WHERE ID(user) = {userId} AND ID(user) <> ID(other) AND NOT (user)-->(other)'
    'RETURN collection(other)',
    'LIMIT 10'
  ].join('\n');

  var params = {
    userId: this.id
  };

  db.query(query, null, function (err, results) {
    if (err) return callback(err);
    var users = results.map(function (result) {
        return new User(result['user']);
    });
    callback(null, users);
  });
};

// static methods:
User.create = function (linkedIn, callback) {
  var dbData = {
    id : linkedIn.id,
    firstName : linkedIn.person.first-name,
    lastName : linkedIn.person.last-name,
    headline: linkedIn.person.headline,
    picture: linkedIn.person.picture-url,
    numConnections: linkedIn.person.connections
  };

  var query = [
    'CREATE (user:User {dbData})',
    'RETURN user',
  ].join('\n');

  var params = {
    data: dbData
  };

  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var user = new User(results[0]['user']);
    callback(null, user);
  });
};

User.get = function (callback) {
  var id = this.id;
  db.getNodeById(id, function (err, node) {
    if (err) return callback(err);
    callback(null, new User(node));
  });
};






// // calls callback w/ (err, following, others) where following is an array of
// // users this user follows, and others is all other users minus him/herself.
// User.prototype.getFollowingAndOthers = function (callback) {
//     // query all users and whether we follow each one or not:
//     var query = [
//         'MATCH (user:User), (other:User)',
//         'OPTIONAL MATCH (user) -[rel:follows]-> (other)',
//         'WHERE ID(user) = {userId}',
//         'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
//     ].join('\n')

//     var params = {
//         userId: this.id,
//     };

//     var user = this;
//     db.query(query, params, function (err, results) {
//         if (err) return callback(err);

//         var following = [];
//         var others = [];

//         for (var i = 0; i < results.length; i++) {
//             var other = new User(results[i]['other']);
//             var follows = results[i]['COUNT(rel)'];

//             if (user.id === other.id) {
//                 continue;
//             } else if (follows) {
//                 following.push(other);
//             } else {
//                 others.push(other);
//             }
//         }

//         callback(null, following, others);
//     });
// };