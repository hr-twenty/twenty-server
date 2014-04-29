/* global require, exports */
var Message = require('./messageModel');

var generalResponse = function(res){
  return function(err, data){
    if(err){
      res.send(500, err);
    } else {
      res.send(200, data);
    }
  };
};

exports.getAllConversations = function(req, res){
  var messageData = req.query;
  Message.getAllConversations(messageData, generalResponse(res));
};

exports.getOneConversation = function(req, res){
  var messageData = req.query;
  Message.getOneConversation(messageData, generalResponse(res));
};

exports.sendMessage = function(req, res){
  var messageData = req.body;
  Message.sendMessage(messageData, generalResponse(res));
};
