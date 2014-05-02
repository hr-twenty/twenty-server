var _ = require('lodash');

module.exports = function(env) {
  return _.merge(
    require('../env/default.js'),
    require('../env/' + env + '.js') || {}
  );
}

