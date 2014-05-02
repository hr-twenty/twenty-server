
var Card = require('../models/cards.js');

// GET /cards
exports.index = function(req, res) {
  Card.getAll()
  .then(function(cards) {
    res.json(cards);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// POST /cards
exports.create = function(req, res) {
  Card.create(req.body[0])
  .then(function() {
    res.send(201);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// GET /cards/:id
exports.show = function(req, res) {
  Card.getById(req.params)
  .then(function(cards) {
    res.json(cards);
  })
  .catch(function(err) {
    res.json(400, err)
  })
};

// PUT /cards/:id
exports.update = function(req, res) {
  Card.update(req.params, req.body[0])
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

// DELETE /cards/:id
exports.destroy = function(req, res) {
  Card.remove(req.params)
  .then(function() {
    res.send(204);
  })
  .catch(function(err) {
    res.json(400, err);
  })
};

