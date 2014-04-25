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
  User.create(req.body, generalResponse(res));
};

exports.getUserData = function(req, res){
  User.get(req.body, generalResponse(res));
};

exports.updateUser = function(req, res){
  User.save(req.body, generalResponse(res));
};

exports.deleteUser = function(req, res){
  User.del(req.body, generalResponse(res));
};

exports.updateUser = function(req, res){
  User.create(req.body, generalResponse(res));
};

//UserStack
exports.getUserStack = function(req, res){
  User.getMessages(req.body, generalResponse(res));
};
exports.approve = function(req, res){
  User.approve(req.body, generalResponse(res));
};

exports.dismiss = function(req, res){
  User.dismiss(req.body, generalResponse(res));
};

//Messages
exports.getMessages = function(req, res){
  User.getMessages(req.body, generalResponse(res));
};

exports.sendMessage = function(req, res){
  User.sendMessage(req.body, generalResponse(res));
};
