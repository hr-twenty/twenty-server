var linkedin = require('../config/linkedin'),
    querystring = require('querystring'),
    request = require('request'),
    https = require('https'),
    http = require('http'),
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
      console.log(url);

      request(url, function(error, response, body) {
        console.log(body);
      });


      // var options = {
      //   hostname: 'www.linkedin.com',
      //   path: '/uas/oauth2/accessToken?' +
      //     querystring.stringify(data),
      //     // '?grant_type=authorization_code' +
      //     // '&code=' + req.query.code +
      //     // '&redirect_uri=' + linkedin.redirectUri +
      //     // '&client_id=' + linkedin.apiKey +
      //     // '&client_secret=' + linkedin.secretKey,
      //   method: 'POST'
      // };
      // var linkedinReq = https.request(options, function(linkedinRes) {
      //   
      //   console.log('status code', linkedinRes.statusCode);
      //
      //   linkedinRes.on('data', function(chunk) {
      //     process.stdout.write(chunk);
      //   });
      //
      // });
      // linkedinReq.
      //     grant_type: 'authorization_code',
      //     code: req.query.code,
      //     redirect_uri: linkedin.redirectUri,
      //     client_id: linkedin.apiKey,
      //     client_secret: linkedin.secretKey
      // linkedinReq.end();


      res.send('hello');

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

