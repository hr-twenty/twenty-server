/* global require, exports */
var Message = require('../models/messages/'),
    helper = require('./helpers');

// GET /conversations/all
exports.index = function(req, res){
  var messageData = req.query;
  Message.getAll(messageData, helper.respond(res));
};

// GET /conversations/one
exports.show = function(req, res){
  var messageData = req.query;
  Message.getOne(messageData, helper.respond(res));
};

// POST /conversations/one
exports.create = function(req, res){
  var messageData = req.body;
  Message.sendMessage(messageData, helper.respond(res, 400, 201));
};
