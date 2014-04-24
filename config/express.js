var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var express = require('express');
var env = require('./env');
console.log('envType', env.envType);

module.exports = function(app) {
  app.set('port', env.port);
  app.use(express.static(path.join(env.rootPath, 'public')));

  app.use(morgan('dev'));

  app.use(bodyParser());
  app.use(methodOverride());
};

