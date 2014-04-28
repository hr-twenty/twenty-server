var linkedin = require('./config/linkedin');
var app = require('express')();


require('./config/express')(app);
require('./app/routes')(app);

var server = app.listen(app.get('port'), function() {
  console.log('Started in env ', process.env.NODE_ENV);
  console.log('Listening on port', app.get('port'), '...');
});


//for testing
module.exports = app;
