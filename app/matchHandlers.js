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

//User
exports.createNewUser = function(req, res){
  var userData = req.body.something;
  User.create(userData, generalResponse(res));
};

exports.getUserData = function(req, res){
  User.get(generalResponse(res));
};

exports.updateUser = function(req, res){
  var userData = req.body.something;
  User.save(userData, generalResponse(res));
};

exports.deleteUser = function(req, res){
  User.del(generalResponse(res));
};

exports.updateUser = function(req, res){
  var userData = req.body.something;
  User.create(userData, generalResponse(res));
};

//UserStack
exports.getUserStack = function(req, res){
  User.getMessages(generalResponse(res));
};
exports.approve = function(req, res){
  var otherId = req.body.id;
  User.approve(otherId, generalResponse(res));
};

//Messages
exports.getMessages = function(req, res){
  User.getMessages(generalResponse(res));
};

exports.sendMessage = function(req, res){
  var otherId = req.body.id;
  User.sendMessage(otherId, generalResponse(res));
};
