var express = require('express'),
    passport = require('passport'),
    config = require('./config/config'),
    linkedin = require('./config/linkedin');

var app = express();

require('./config/express')(app, express, config);
require('./config/passport')(app, passport, linkedin);
require('./app/routes')(app, passport);

app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port') + '...');
});

