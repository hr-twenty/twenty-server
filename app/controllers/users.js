/* global require, exports */
var User = require('../userModel'),
    helper = require('./helper');

// POST /user
exports.createNewUser = function(req, res){
  var userData = req.body;
  User.create(userData, helper.respond(res, 400, 201));
};

exports.getUserData = function(req, res){
  var userData = req.query;
  User.get(userData, helper.respond(res));
};

exports.updateUser = function(req, res){
  var userData = req.body;
  User.save(userData, helper.respond(res));
};

exports.deleteUser = function(req, res){
  var userData = req.body;
  User.del(userData, helper.respond(res));
};
