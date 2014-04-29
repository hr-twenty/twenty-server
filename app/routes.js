/* global require */
var querystring = require('querystring'),
    request = require('request'),
    userHandlers = require('./userHandlers'),
    stackHandlers = require('./stackHandlers'),
    messageHandlers = require('./messageHandlers'),
    userModel = require('./userModel');

module.exports = function(app, passport) {
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

  // Sign in/out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Linkedin api user call
  app.get('/api/user', function(req, res) {
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
      ')?format=json&' +
      oauth2AccessToken;

    request(url, function(error, response, body) {

      body = JSON.parse(body);
      var queryParams = {
        userId: body.id,
        firstName: body.firstName,
        lastName: body.lastName,
        headline: body.headline,
        picture: body.pictureUrl || '',
        numConnections: body.numConnections,
        locationCity: body.location.name,
        locationCountry: body.location.country.code,
        industryName: body.industry,
        curPositionTitle: '',
        curCompanyName: '',
        companySize: '',
        languageName: '',
        skillName: '',
        schoolName: '',
        curCompanyStartDate: '',
        curCompanyEndDate: '',
        languageProficiency: '',
        schoolFieldOfStudy: '',
        schoolStartDate: '',
        schoolEndDate: ''
      };

      userModel.create(queryParams, function(err, finalResults) {
        res.send(finalResults || err);
      });
    });
  });


  // Catch-all route
  app.route('/*')
  .get(function(req, res) {
    res.send(404);
  });

};

