/* global require, exports */
var Stack = require('../models/stacks/'),
    helper = require('./helpers');

// GET /userStack
exports.show = function(req, res){
  var stackData = req.query;
  Stack.getStack(stackData, helper.respond(res));
};

// POST /userStack/:action
exports.action = function(req, res){
  var stackData = req.body;
  Stack[req.params.action](stackData, helper.respond(res, 400, 201));
};

