var express = require('express'),
    passport = require('passport'),
    env = require('./config/env')(process.env.NODE_ENV || 'development'),
    app = express();

require('dns').lookup(require('os').hostname(), function(err, ip) {

  require('./config/express')(app, express, env);
  require('./config/passport')(app, passport, ip, env.port);
  require('./app/routes')(app, passport);

  var server = app.listen(app.get('port'), function() {
    console.log('Server listening at %s on port %d in %s environment...', env.ip, env.port, env.envType);
  });

  //for testing
  module.exports = app;

});

