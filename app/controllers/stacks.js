
var Stack = require('../models/stacks/');

// GET /stacks
exports.index = function(req, res) {
  Stack.getAll(function(err, stacks) {
    if (err) res.json(400, err);
    else res.json(stacks);
  });
};

// POST /stacks
exports.create = function(req, res) {
  Stack.create(req.body[0], function(err) {
    if (err) res.json(400, err);
    else res.send(201);
  });
};

// GET /stacks/:id
exports.show = function(req, res) {
  Stack.getById(req.params, function(err, stacks) {
    if (err) res.json(400, err);
    else res.json(stacks);
  });
};

// PUT /stacks/:id
exports.update = function(req, res) {
  Stack.update(req.params, req.body[0], function(err) {
    if (err) res.json(400, err);
    else res.send(204);
  });
};

// DELETE /stacks/:id
exports.destroy = function(req, res) {
  Stack.remove(req.params, function(err) {
    if (err) res.json(400, err);
    else res.send(204);
  });
};

