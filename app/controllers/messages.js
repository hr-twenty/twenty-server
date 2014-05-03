
var _ = require('lodash'),
    Message = require('../models/messages/');

// GET /messages
exports.index = function(req, res) {
  Message.getAllMessages(function(err, messages) {
    if (err) res.json(400, err);
    else res.json(req.query, messages);
  });
};

// POST /messages
exports.create = function(req, res) {
  Message.sendMessage(req.body[0], function(err) {
    if (err) res.json(400, err);
    else res.send(201);
  });
};

// GET /messages/:id
exports.show = function(req, res) {
  Message.getOneMessage(_.extend(req.params, req.query), function(err, messages) {
    if (err) res.json(400, err);
    else res.json(messages);
  });
};

// PUT /messages/:id
// exports.update = function(req, res) {
//   Message.update(req.params, req.body[0], function(err) {
//     if (err) res.json(400, err);
//     else res.send(204);
//   });
// };

// DELETE /messages/:id
// exports.destroy = function(req, res) {
//   Message.remove(req.params, function(err) {
//     if (err) res.json(400, err);
//     else res.send(204);
//   });
// };

