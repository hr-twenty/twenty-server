
var Stack = require('../models/stacks.js');

// GET /stacks
exports.index = function(req, res) {
  Stack.getAll()
  .then(function(stacks) {
    res.json(stacks);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// POST /stacks
exports.create = function(req, res) {
  Stack.create(req.body[0])
  .then(function() {
    res.send(201);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// GET /stacks/:id
exports.show = function(req, res) {
  Stack.getById(req.params)
  .then(function(stacks) {
    res.json(stacks);
  })
  .catch(function(err) {
    res.json(400, err)
  })
};

// PUT /stacks/:id
exports.update = function(req, res) {
  Stack.update(req.params, req.body[0])
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// DELETE /stacks/:id
exports.destroy = function(req, res) {
  Stack.remove(req.params)
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

