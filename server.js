<<<<<<< HEAD
var express = require('express'),
    config = require('./config/config'),
    linkedin = require('./config/linkedin');
=======
var app = require('express')();
>>>>>>> 0888558168f3a3f99878c011e93c1dd7b8ba9aa2

require('./config/express')(app);
require('./config/routes')(app);

<<<<<<< HEAD
require('./config/express')(app, config);
require('./config/passport')(app, linkedin);
require('./app/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port') + '...');
=======
var server = app.listen(app.get('port'), function() {
  console.log('Started in env ', process.env.NODE_ENV);
  console.log('Listening on port', app.get('port'), '...');
>>>>>>> 0888558168f3a3f99878c011e93c1dd7b8ba9aa2
});

//for testing
module.exports = app;
