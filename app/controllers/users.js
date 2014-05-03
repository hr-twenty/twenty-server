
var User = require('../models/users/');

// GET /users
exports.index = function(req, res) {
  User.getAll(function(err, users) {
    if (err) res.json(400, err);
    else res.json(users);
  });
};

// POST /users
exports.create = function(req, res) {
  User.create(req.body[0], function(err) {
    if (err) res.json(400, err);
    else res.send(201);
  });
};

// GET /users/:id
exports.show = function(req, res) {
  User.getById(req.params, function(err, users) {
    if (err) res.json(400, err);
    else res.json(users);
  });
};

// PUT /users/:id
exports.update = function(req, res) {
  User.update(req.params, req.body[0], function(err) {
    if (err) res.json(400, err);
    else res.send(204);
  });
};

// DELETE /users/:id
exports.destroy = function(req, res) {
  User.remove(req.params, function(err) {
    if (err) res.json(400, err);
    else res.send(204);
  });
};

