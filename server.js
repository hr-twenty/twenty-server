var express = require('express'),
    config = require('./config/config'),
    linkedin = require('./config/linkedin');

var app = express();

require('./config/express')(app, config);
require('./config/passport')(app, linkedin);
require('./app/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port') + '...');
});

