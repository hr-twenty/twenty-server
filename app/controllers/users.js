/* global require, exports */
var User = require('../models/users/'),
    helper = require('./helpers');

// POST /user
exports.create = function(req, res){
  var userData = req.body;
  User.create(userData, helper.respond(res, 400, 201));
};

// GET /user
exports.show = function(req, res){
  var userData = req.query;
  User.get(userData, helper.respond(res));
};

// PUT /user
exports.update = function(req, res){
  var userData = req.body;
  User.save(userData, helper.respond(res));
};

// DELETE /user
exports.destroy = function(req, res){
  var userData = req.body;
  User.del(userData, helper.respond(res));
};
