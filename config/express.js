/* global require, module */
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var env = require('./env');

module.exports = function(app) {
  app.set('port', env.port);
  app.use(express.static(path.join(env.rootPath, 'public')));

  app.use(morgan('dev'));

  app.use(bodyParser());
  app.use(methodOverride());

  app.use(cookieParser());
  app.use(session({ secret: 'my secret' }));
};

