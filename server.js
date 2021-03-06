
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    passport = require('passport'),
    env = require('./env')(process.env.NODE_ENV),
    app = express();


function bootstrap(ip, port, envType) {
  require('./config/express')(app, express, env);
  require('./config/passport')(app, passport, ip, port);
  require('./config/routes')(app, passport);

  var server = app.listen(port, function() {
    console.log('Server listening at %s on port %d in %s environment...', ip, port, envType);
  });

  //for testing
  module.exports = app;
}

// if (env.envType === 'development') {
//   require('dns').lookup(require('os').hostname(), function(err, ip) {
//     bootstrap(ip, env.port, env.envType);
//   });
// } else {
  bootstrap(env.ip, env.port, env.envType);
// }

