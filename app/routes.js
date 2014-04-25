//var linkedin = require('../config/linkedin'),
var querystring = require('querystring'),
    request = require('request');

module.exports = function(app, passport) {

  // Authentication routes
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: 'SOME STATE' }),
    function(req, res) {
    });

  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });


  // Catch-all route
  app.route('/*')
  .get(function(req, res) {
    res.send(404);
  });

};

