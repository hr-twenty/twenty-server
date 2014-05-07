/* global require, exports */
var Stack = require('../models/stacks/');

// GET /userStack
exports.show = function(req, res){
  var stackData = req.query;
  Stack.getStack(stackData, helper.respond(res));
};

// POST /userStack/:action
exports.create = function(req, res){
  var stackData = req.body;
  Stack[req.param.action](stackData, helper.respond(res, 400, 201));
};

