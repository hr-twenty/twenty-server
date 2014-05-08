/* global require, module */
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

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
