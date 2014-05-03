/* global require, exports */
var Stack = require('../stackModel'),
    helper = require('./helper');


// GET /userStack
exports.getStack = function(req, res){
  var stackData = req.query;
  Stack.getStack(stackData, helper.respond(res));
};

// POST /userStack/approve
exports.approve = function(req, res){
  var stackData = req.body;
  Stack.approve(stackData, helper.respond(res, 400, 201));
};

// POST /userStack/reject
exports.reject = function(req, res){
  var stackData = req.body;
  Stack.reject(stackData, helper.respond(res, 400, 201));
};

// POST /userStack/reset
exports.resetStack = function(req, res){
  var stackData = req.body;
  Stack.resetStack(stackData, helper.respond(res, 400, 201));
};

