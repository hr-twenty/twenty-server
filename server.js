var express = require('express'),
    passport = require('passport'),
    env = require('./config/env'),
    linkedin = require('./config/linkedin'),
    app = express();

require('./config/express')(app, express, env);
require('./config/passport')(app, passport, linkedin);
require('./app/routes')(app, passport);

var server = app.listen(app.get('port'), function() {
  console.log('Started in env ', process.env.NODE_ENV);
  console.log('Listening on port', app.get('port'), '...');
});


//for testing
module.exports = app;
