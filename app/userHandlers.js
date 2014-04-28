/* global require, exports */
var User = require('./userModel');

var generalResponse = function(res){

  return function(err, data){
    if(err){
      res.send(500, err);
    } else {
      res.send(200, data);
    }
  };
};

exports.createNewUser = function(req, res){
  var userData = req.body;
  User.create(userData, generalResponse(res));
};

exports.getUserData = function(req, res){
  var userData = req.query;
  User.get(userData, generalResponse(res));
};

exports.updateUser = function(req, res){
  var userData = req.body;
  User.save(userData, generalResponse(res));
};

exports.deleteUser = function(req, res){
  var userData = req.body;
  User.del(userData, generalResponse(res));
};