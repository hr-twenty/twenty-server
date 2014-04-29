var express = require('express'),
    passport = require('passport'),
    env = require('./config/env')(process.env.NODE_ENV || 'development'),
    app = express();

require('./config/express')(app, express, env);
require('./config/passport')(app, passport);
require('./app/routes')(app, passport);

var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port %d in %s environment...', env.port, env.envType);
});


//for testing
module.exports = app;
