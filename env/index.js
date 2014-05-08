var _ = require('lodash');

module.exports = function() {
  var env = process.env.NODE_ENV || 'development'
  var envs = _.merge(
    require('./lib/default.js'),
    require('./lib/' + env + '.js') || {}
  );

  return _.merge(envs,
    require('./lib/secrets.js') || {}
  );
}

