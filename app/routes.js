var linkedin = require('../config/linkedin'),
    querystring = require('querystring'),
    request = require('request'),
    passport = require('passport');

module.exports = function(app) {

  app.route('/auth/linkedin')
  .get(function(req, res) {
    // change state vs secrete key
    res.redirect('https://www.linkedin.com/uas/oauth2/authorization' +
      '?response_type=code' +
      '&client_id=' + linkedin.apiKey  +
      '&state=' + linkedin.secretKey + 'bad' +
      '&redirect_uri=' + linkedin.redirectUri);
  });

  app.route('/auth/linkedin/callback')
  .get(function(req, res) {
    if (req.query.state === linkedin.secretKey + 'bad') {
      var data = {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: linkedin.redirectUri,
        client_id: linkedin.apiKey,
        client_secret: linkedin.secretKey
      };
      
      var url = 'https://www.linkedin.com/uas/oauth2/accessToken?' +
        querystring.stringify(data);

      request(url, function(error, response, body) {
        var json = JSON.parse(body);
        var accessQuery = '?' + querystring.stringify({
          oauth2_access_token: json.access_token
        });

        var personUrl = 'https://api.linkedin.com/v1/people/~' +
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
          ')' +
          accessQuery;
        request(personUrl, function(error, response, body) {
          res.send(body);
        });
      });
    } else {
      res.send('CSRF detected...');
    }
  });



  // app.get('/auth/linkedin', passport.authenticate('linkedin'));
  //
  // app.get('/auth/linkedin/callback',
  // passport.authenticate('linkedin', { failureRedirect: '/login' }),
  // function(req, res) {
  //   // Successful authentication, redirect home.
  //   res.redirect('/');
  // });


  app.route('/*')
  .get(function(req, res) {
    res.send(404);
  });

};

