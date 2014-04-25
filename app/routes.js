/* global require */
var linkedin = require('../config/linkedin');
var https = require('https');
var passport = require('passport');
var matchHandlers = require('./matchHandlers')

module.exports = function(app) {

//Users
  app.get('/user', matchHandlers.getUserData)
  app.post('/user', matchHandlers.createNewUser);
  app.put('/user', matchHandlers.updateUser)
  app.del('/user', matchHandlers.deleteUser)

//UserStack
  app.get('/userStack', matchHandlers.getUserStack)
  app.post('/userStack', matchHandlers.approve)

//Messages
  app.get('/messages', matchHandlers.getMessages)
  app.post('/messages', matchHandlers.postMessage)

//LinkedIn
  app.route('/auth/linkedin')
  .get(function(req, res) {
    res.redirect('https://www.linkedin.com/uas/oauth2/authorization' +
      '?response_type=code' +
      '&client_id=' + linkedin.apiKey +
      '&state=' + linkedin.secretKey +
      '&redirect_uri=' + linkedin.redirectUri);
  });

  app.route('/auth/linkedin/callback')
  .get(function(req, res) {
    if (req.query.state === linkedin.secretKey) {
      var options = {
        hostname: 'www.linkedin.com',
        path: '/uas/oauth2/accessToken' +
          '?grant_type=authorization_code' +
          '&code=' + req.query.code +
          '&redirect_uri=' + linkedin.redirectUri +
          '&client_id=' + linkedin.apiKey +
          '&client_secret=' + linkedin.secretKey,
        method: 'POST'
      };

      console.log(options);

      var linkedinReq = https.request(options, function(linkedinRes) {
        console.log('status code:', linkedinRes.statusCode)
        console.log('hello');
      });
      linkedinReq.end();


      // var linkedinRes;
      // var linkedinReq = https.request(options, function(response) {
      //   console.log('status code:', response.statusCode);
      //   console.log('headers:', response.headers);
      //   
      //   response.on('data', function(chunk) {
      //     console.log('BODY: ' + chunk);
      //     linkedinRes = chunk;
      //     res.send(chunk);
      //   });
      // });
      // linkedinReq.end();
      //
      // linkedinReq.on('error', function(e) {
      //   console.error('linkedin error', e);
      // });

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

