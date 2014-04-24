var express = require('express'),
    config = require('./config/config');

var app = express();

require('./config/express')(app, config);
require('./app/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port') + '...');
});

console.log(process.env.ENVIRONMENT);