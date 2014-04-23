var appRoot = __dirname,
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require('path');

module.exports = function(app, config) {
  app.set('port', config.port);

  app.use(express.static(path.join(appRoot, 'public')));

  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
};

