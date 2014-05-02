
var Message = require('../models/messages.js');

// GET /messages
exports.index = function(req, res) {
  Message.getAll()
  .then(function(messages) {
    res.json(messages);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// POST /messages
exports.create = function(req, res) {
  Message.create(req.body[0])
  .then(function() {
    res.send(201);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// GET /messages/:id
exports.show = function(req, res) {
  Message.getById(req.params)
  .then(function(messages) {
    res.json(messages);
  })
  .catch(function(err) {
    res.json(400, err)
  })
};

// PUT /messages/:id
exports.update = function(req, res) {
  Message.update(req.params, req.body[0])
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// DELETE /messages/:id
exports.destroy = function(req, res) {
  Message.remove(req.params)
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

