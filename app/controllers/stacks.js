
var _ = require('lodash'),
    Stack = require('../models/stacks/');

// GET /stacks
exports.index = function(req, res) {
  Stack.getStack(_.extend(req.param, req.query), function(err, stacks) {
    if (err) res.json(400, err);
    else res.json(stacks);
  });
};

// POST /stacks
exports.create = function(req, res) {
  var fn;
  if (req.query.status === 'approve') fn = Stack.approve;
  else if (req.query.status === 'reject') fn = Stack.reject;
  else if (req.query.status === 'reset') fn = Stack.reset;

  fn(req.body[0], function(err) {
    if (err) res.json(400, err);
    else res.send(201);
  });
};

// GET /stacks/:id
// exports.show = function(req, res) {
//   Stack.getById(req.params, function(err, stacks) {
//     if (err) res.json(400, err);
//     else res.json(stacks);
//   });
// };

// PUT /stacks/:id
// exports.update = function(req, res) {
//   Stack.update(req.params, req.body[0], function(err) {
//     if (err) res.json(400, err);
//     else res.send(204);
//   });
// };

// DELETE /stacks/:id
// exports.destroy = function(req, res) {
//   Stack.remove(req.params, function(err) {
//     if (err) res.json(400, err);
//     else res.send(204);
//   });
// };

