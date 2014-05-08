
exports.respond = function(res, errStatusCode, successStatusCode) {
  errStatusCode = errStatusCode || 400;
  successStatusCode = successStatusCode || 200;

  return function(err, data) {
    if (err) res.send(errStatusCode, err);
    else res.send(successStatusCode, data)
  };
};
