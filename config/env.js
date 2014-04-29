var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';

module.exports = _.merge(
  require('../env/default.js'),
  require('../env/' + env + '.js') || {}
  );

