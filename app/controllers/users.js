
var User = require('../models/users.js');

// GET /users
exports.index = function(req, res) {
  User.getAll()
  .then(function(users) {
    res.json(users);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// POST /users
exports.create = function(req, res) {
  User.create(req.body[0])
  .then(function() {
    res.send(201);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// GET /users/:id
exports.show = function(req, res) {
  User.getById(req.params)
  .then(function(users) {
    res.json(users);
  })
  .catch(function(err) {
    res.json(400, err)
  })
};

// PUT /users/:id
exports.update = function(req, res) {
  User.update(req.params, req.body[0])
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// DELETE /users/:id
exports.destroy = function(req, res) {
  User.remove(req.params)
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

