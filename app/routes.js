//var linkedin = require('../config/linkedin'),
var querystring = require('querystring'),
    request = require('request');

module.exports = function(app, passport) {

  // Authentication routes
  app.route('/auth/linkedin')
  .get(
    passport.authenticate('linkedin', { state: 'SOME STATE' })
  );

  app.route('/auth/linkedin/callback')
  .get(
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  // Linkedin api user call
  app.route('/api/user')
  .get(function(req, res) {
    var oauth2AccessToken = querystring.stringify({
      oauth2_access_token: req.session.accessToken
    });
    var url = 'https://api.linkedin.com/v1/people/~' +
      ':(' +
      'id,first-name,last-name,headline,picture-url,numConnections,' +
      'location:(name,country),' +
      'industry,' +
      'positions:(title,' +
      'company:(name,' +
      'size)),' +
      'languages:(language:(name)),' +
      'skills:(skill:(name)),' +
      'educations:(school-name)' +
      ')?' +
      oauth2AccessToken;

    request(url, function(error, response, body) {
      res.send(body);
    });
  });


  // Catch-all route
  app.route('/*')
  .get(function(req, res) {
    res.send(404);
  });

};

