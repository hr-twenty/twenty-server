/* global require */
var linkedin = require('../config/linkedin');
var https = require('https');
var userHandlers = require('./userHandlers');
var stackHandlers = require('./stackHandlers');
var messageHandlers = require('./messageHandlers');

module.exports = function(app) {

//Users
  app.get('/user', userHandlers.getUserData);
  app.post('/user', userHandlers.createNewUser);
  app.put('/user', userHandlers.updateUser);
  app.del('/user', userHandlers.deleteUser);

//UserStack
  app.post('/userStack/approve', stackHandlers.approve);
  app.post('/userStack/reject', stackHandlers.reject);
  app.get('/userStack', stackHandlers.getStack);

//Messages
  app.get('/conversations/all', messageHandlers.getAllConversations);
  app.get('/conversations/one', messageHandlers.getOneConversation);
  app.post('/conversations/one', messageHandlers.sendMessage);

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

