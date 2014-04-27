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
  User.del(generalResponse(res));
};

//UserStack
exports.getUserStack = function(req, res){
  var userData = req.query;
  User.getUserStack(userData, generalResponse(res));
};

exports.approve = function(req, res){
  var userData = req.body;
  User.approve(userData, generalResponse(res));
};

exports.reject = function(req, res){
  var userData = req.body;
  User.reject(userData, generalResponse(res));
};

//Messages
exports.getAllConversations = function(req, res){
  var userData = req.query;
  User.getAllConversations(userData, generalResponse(res));
};

exports.getOneConversation = function(req, res){
  var userData = req.query;
  User.getOneConversation(userData, generalResponse(res));
};

exports.sendMessage = function(req, res){
  var userData = req.body;
  User.sendMessage(userData, generalResponse(res));
};
