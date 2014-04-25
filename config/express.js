var path = require('path'),
    appRoot = path.normalize(__dirname + '/..'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');

module.exports = function(app, express, config) {
  app.set('port', config.port);

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(session({ secret: 'my secret' }));

  app.use(express.static(path.join(appRoot, 'public')));
};

