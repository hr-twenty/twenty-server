/* global require, exports */
var Stack = require('./stackModel');

var generalResponse = function(res){
  return function(err, data){
    if(err){
      res.send(500, err);
    } else {
      res.send(200, data);
    }
  };
};

exports.getStack = function(req, res){
  var stackData = req.query;
  Stack.getStack(stackData, generalResponse(res));
};

exports.approve = function(req, res){
  var stackData = req.body;
  Stack.approve(stackData, generalResponse(res));
};

exports.reject = function(req, res){
  var stackData = req.body;
  Stack.reject(stackData, generalResponse(res));
};

exports.resetStack = function(req, res){
  var stackData = req.body;
  Stack.resetStack(stackData, generalResponse(res));
};