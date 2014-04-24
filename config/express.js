var path = require('path'),
    appRoot = path.normalize(__dirname + '/..'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

module.exports = function(app, config) {
  app.set('port', config.port);

  app.use(express.static(path.join(appRoot, 'public')));

  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());

  app.use(cookieParser());
  app.use(session({ secret: 'my secret' }));
};

