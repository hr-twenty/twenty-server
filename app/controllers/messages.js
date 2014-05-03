/* global require, exports */
var Message = require('../messageModel'),
    helper = require('./helper');

// GET /conversations/all
// exports.getAllConversations
exports.index = function(req, res){
  var messageData = req.query;
  Message.getAllConversations(messageData, helper.respond(res));
};

// GET /conversations/one
// exports.getOneConversation
exports.show = function(req, res){
  var messageData = req.query;
  Message.getOneConversation(messageData, helper.respond(res));
};

// POST /conversations/one
// exports.sendMessage
exports.create = function(req, res){
  var messageData = req.body;
  Message.sendMessage(messageData, helper.respond(res, 400, 201));
};
