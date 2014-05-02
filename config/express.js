/* global require, module */
var path = require('path'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');

module.exports = function(app, express, env) {

  app.set('port', env.port);

  app.use(morgan('dev'));

  app.use(bodyParser());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({ secret: 'my secret' }));

  app.use(express.static(path.join(env.rootPath, 'public')));

  app.use(require('./cors'));
};
